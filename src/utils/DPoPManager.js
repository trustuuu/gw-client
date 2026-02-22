import * as jose from "jose";

/**
 * DPoP Manager - Secure key management using IndexedDB + Web Crypto API
 *
 * This class manages DPoP (Demonstrating Proof-of-Possession) keys using:
 * - Non-extractable cryptographic keys (cannot be exported, even by malicious scripts)
 * - IndexedDB for persistent storage across browser sessions
 * - Web Crypto API for hardware-backed security on supported devices
 *
 * Security Benefits:
 * - XSS Protection: Private keys cannot be extracted even if XSS occurs
 * - Hardware-backed: Keys may be stored in TPM/Secure Enclave
 * - Same-origin isolation: Keys are isolated per origin by browser
 */
class DPoPManager {
  constructor(dbName = "DPoPKeyStore", dbVersion = 1) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.keyPair = null;
    this.initPromise = null;
  }

  /**
   * Initialize the DPoP manager and ensure keys are ready
   * @returns {Promise<void>}
   */
  async initialize() {
    // Prevent multiple simultaneous initializations
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  async _doInitialize() {
    try {
      this.keyPair = await this.getOrCreateKeyPair();
    } finally {
      this.initPromise = null;
    }
  }

  /**
   * Get existing key pair or create a new one
   * @returns {Promise<CryptoKeyPair>}
   */
  async getOrCreateKeyPair() {
    let keyPair = await this.retrieveKeyPair();

    if (!keyPair.privateKey || !keyPair.publicKey) {
      console.log("No existing DPoP keys found, generating new key pair...");
      keyPair = await this.generateKeyPair();
      await this.storeKeyPair(keyPair);
      console.log("New DPoP key pair generated and stored");
    } else {
      console.log("Existing DPoP key pair loaded from IndexedDB");
    }

    return keyPair;
  }

  /**
   * Generate a new non-extractable ES256 key pair
   * @returns {Promise<CryptoKeyPair>}
   */
  async generateKeyPair() {
    // CRITICAL: extractable = false ensures keys cannot be exported
    return await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256", // ES256
      },
      false, // ⚠️ NON-EXTRACTABLE - keys cannot be exported
      ["sign", "verify"],
    );
  }

  /**
   * Store key pair in IndexedDB
   * @param {CryptoKeyPair} keyPair
   * @returns {Promise<void>}
   */
  async storeKeyPair(keyPair) {
    const db = await this.openDB();
    const transaction = db.transaction(["keys"], "readwrite");
    const store = transaction.objectStore("keys");

    store.put(keyPair.privateKey, "dpop-private-key");
    store.put(keyPair.publicKey, "dpop-public-key");

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  }

  /**
   * Retrieve key pair from IndexedDB
   * @returns {Promise<{privateKey: CryptoKey|null, publicKey: CryptoKey|null}>}
   */
  async retrieveKeyPair() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["keys"], "readonly");
      const store = transaction.objectStore("keys");

      const privateKey = await this.getFromStore(store, "dpop-private-key");
      const publicKey = await this.getFromStore(store, "dpop-public-key");

      db.close();
      return { privateKey, publicKey };
    } catch (error) {
      console.warn("Error retrieving DPoP keys from IndexedDB:", error);
      return { privateKey: null, publicKey: null };
    }
  }

  /**
   * Open IndexedDB database
   * @returns {Promise<IDBDatabase>}
   */
  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys");
        }
      };

      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Get a value from an IndexedDB object store
   * @param {IDBObjectStore} store
   * @param {string} key
   * @returns {Promise<any>}
   */
  getFromStore(store, key) {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Create a DPoP proof JWT
   * @param {string} method - HTTP method (e.g., "POST", "GET")
   * @param {string} url - Full URL of the request
   * @param {string|null} accessToken - Optional access token to bind (for resource requests)
   * @returns {Promise<string>} The DPoP proof JWT
   */
  async createProof(method, url, accessToken = null) {
    // Ensure keys are initialized
    if (!this.keyPair) {
      await this.initialize();
    }

    // Export public key as JWK for the header
    // Note: We can export the PUBLIC key, just not the private key
    const publicJWK = await window.crypto.subtle.exportKey(
      "jwk",
      this.keyPair.publicKey,
    );

    // Parse URL to get htu (without query/fragment)
    const urlObj = new URL(url);
    const htu = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

    // Create the DPoP proof payload
    const payload = {
      jti: crypto.randomUUID(), // Unique identifier for replay protection
      htm: method, // HTTP method
      htu: htu, // HTTP URI (without query/fragment)
      iat: Math.floor(Date.now() / 1000), // Issued at timestamp
    };

    // If an access token is provided, include its hash (for resource requests)
    if (accessToken) {
      const encoder = new TextEncoder();
      const data = encoder.encode(accessToken);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const ath = btoa(String.fromCharCode(...hashArray))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      payload.ath = ath;
    }

    // Sign the DPoP proof using jose library
    // The private key is used for signing but remains non-extractable
    const dpopProof = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: "ES256",
        typ: "dpop+jwt",
        jwk: {
          kty: publicJWK.kty,
          crv: publicJWK.crv,
          x: publicJWK.x,
          y: publicJWK.y,
        },
      })
      .sign(this.keyPair.privateKey);

    return dpopProof;
  }

  /**
   * Rotate keys - generate and store a new key pair
   * Use this periodically or after security events
   * @returns {Promise<CryptoKeyPair>}
   */
  async rotateKeys() {
    console.log("Rotating DPoP keys...");
    const newKeyPair = await this.generateKeyPair();
    await this.storeKeyPair(newKeyPair);
    this.keyPair = newKeyPair;
    console.log("DPoP keys rotated successfully");
    return newKeyPair;
  }

  /**
   * Clear all stored keys (call on logout)
   * @returns {Promise<void>}
   */
  async clearKeys() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["keys"], "readwrite");
      const store = transaction.objectStore("keys");

      store.delete("dpop-private-key");
      store.delete("dpop-public-key");

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          db.close();
          this.keyPair = null;
          console.log("DPoP keys cleared successfully");
          resolve();
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error("Error clearing DPoP keys:", error);
      throw error;
    }
  }

  /**
   * Get the JWK thumbprint of the current public key
   * This is used for key binding validation
   * @returns {Promise<string>}
   */
  async getJwkThumbprint() {
    if (!this.keyPair) {
      await this.initialize();
    }

    const publicJWK = await window.crypto.subtle.exportKey(
      "jwk",
      this.keyPair.publicKey,
    );

    return await jose.calculateJwkThumbprint(publicJWK, "sha256");
  }

  async verifyAndStoreToken(tokenResponse) {
    const accessToken = tokenResponse.access_token;

    // 1. 서버가 준 토큰의 페이로드 해독 (라이브러리 사용 혹은 base64 decode)
    const payloadBase64 = accessToken.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    // 2. 내 현재 공개키의 지문(Thumbprint) 계산
    const myJkt = await this.getJwkThumbprint();

    // 3. 서버가 토큰에 박아놓은 지문(cnf.jkt)과 대조
    if (payload.cnf && payload.cnf.jkt === myJkt) {
      console.log("✅ 토큰 바인딩 성공: 이 토큰은 내 키에 종속되었습니다.");
      this.saveToken(accessToken); // 안전하게 저장
    } else {
      console.error("❌ 토큰 바인딩 실패: 키 지문이 일치하지 않습니다!");
    }
  }
}

// Create and export a singleton instance
const dpopManager = new DPoPManager();

export default dpopManager;
