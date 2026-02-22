import * as jose from "jose";

/**
 * Crypto Manager - Secure symmetric encryption using IndexedDB + Web Crypto API
 *
 * This class manages an AES-GCM key for encrypting data before saving to localStorage:
 * - Non-extractable cryptographic key (cannot be exported by malicious scripts)
 * - IndexedDB for persistent secure storage of the key across browser sessions
 * - Web Crypto API for fast, hardware-backed AES encryption
 */
class CryptoManager {
  constructor(dbName = "ChatKeyStore", dbVersion = 1) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.cryptoKey = null;
    this.initPromise = null;
  }

  /**
   * Initialize the Crypto manager and ensure the AES key is ready
   */
  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  async _doInitialize() {
    try {
      this.cryptoKey = await this.getOrCreateKey();
    } finally {
      this.initPromise = null;
    }
  }

  /**
   * Get existing AES key or create a new one
   */
  async getOrCreateKey() {
    let key = await this.retrieveKey();
    if (!key) {
      console.log(
        "No existing Encryption key found, generating new AES key...",
      );
      key = await this.generateKey();
      await this.storeKey(key);
    }
    return key;
  }

  /**
   * Generate a new non-extractable AES-GCM key
   */
  async generateKey() {
    // CRITICAL: extractable = false ensures the key material cannot be exported to JavaScript variables
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      false, // non-extractable
      ["encrypt", "decrypt"],
    );
  }

  /**
   * Store AES key in IndexedDB
   */
  async storeKey(key) {
    const db = await this.openDB();
    const transaction = db.transaction(["keys"], "readwrite");
    const store = transaction.objectStore("keys");

    store.put(key, "aes-gcm-key");

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
   * Retrieve AES key from IndexedDB
   */
  async retrieveKey() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["keys"], "readonly");
      const store = transaction.objectStore("keys");

      const key = await this.getFromStore(store, "aes-gcm-key");
      db.close();
      return key;
    } catch (error) {
      console.warn("Error retrieving Crypto key from IndexedDB:", error);
      return null;
    }
  }

  /**
   * Open IndexedDB database
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
   */
  getFromStore(store, key) {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Encrypt arbitrary JS object
   * Returns a base64 string combining IV + Ciphertext
   */
  async encryptData(data) {
    if (!data) return null;
    if (!this.cryptoKey) await this.initialize();

    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(jsonString);

      // AES-GCM requires a unique IV for each encryption
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const ciphertextBuffer = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.cryptoKey,
        encodedData,
      );

      // Combine IV and Ciphertext into a single byte array
      const ivArray = Array.from(iv);
      const cipherArray = Array.from(new Uint8Array(ciphertextBuffer));
      const combined = [...ivArray, ...cipherArray];

      // Convert to base64 for storage in localStorage
      return btoa(String.fromCharCode.apply(null, combined));
    } catch (err) {
      console.error("Encryption failed:", err);
      return null;
    }
  }

  /**
   * Decrypt base64 string back into JS object
   */
  async decryptData(base64String) {
    if (!base64String) return null;
    if (!this.cryptoKey) await this.initialize();

    try {
      // Decode base64 back into byte array
      const binaryStr = atob(base64String);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // Extract IV (first 12 bytes) and Ciphertext
      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.cryptoKey,
        ciphertext,
      );

      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decryptedBuffer);
      return JSON.parse(jsonString);
    } catch (err) {
      console.error("Decryption failed:", err);
      return null;
    }
  }

  /**
   * Clear all stored keys (call on logout to shred data access forever)
   */
  async clearKey() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["keys"], "readwrite");
      const store = transaction.objectStore("keys");

      store.delete("aes-gcm-key");

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          db.close();
          this.cryptoKey = null;
          console.log("Crypto key cleared successfully");
          resolve();
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error("Error clearing Crypto key:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const cryptoManager = new CryptoManager();

export default cryptoManager;
