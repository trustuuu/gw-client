/**
 * DPoP Testing Utilities
 *
 * This file provides utilities for testing and debugging the DPoP implementation.
 * Use these functions in the browser console to verify the security and functionality.
 */

import dpopManager from "./DPoPManager.js";
import { generateDpopProof, getDpopKeyThumbprint } from "./dpop.js";

/**
 * Test Suite for DPoP Implementation
 */
export const DPoPTests = {
  /**
   * Test 1: Verify keys are stored in IndexedDB
   */
  async testKeyStorage() {
    console.log("=== Test 1: Key Storage ===");
    try {
      await dpopManager.initialize();
      console.log("✓ DPoP manager initialized");

      const db = await indexedDB.open("DPoPKeyStore", 1);
      console.log("✓ IndexedDB opened successfully");

      const transaction = db.transaction(["keys"], "readonly");
      const store = transaction.objectStore("keys");

      const privateKeyRequest = store.get("dpop-private-key");
      const publicKeyRequest = store.get("dpop-public-key");

      const privateKey = await new Promise((resolve) => {
        privateKeyRequest.onsuccess = () => resolve(privateKeyRequest.result);
      });

      const publicKey = await new Promise((resolve) => {
        publicKeyRequest.onsuccess = () => resolve(publicKeyRequest.result);
      });

      db.close();

      if (privateKey && publicKey) {
        console.log("✓ Keys found in IndexedDB");
        console.log("  Private key type:", privateKey.type);
        console.log("  Public key type:", publicKey.type);
        console.log("  Algorithm:", privateKey.algorithm.name);
        console.log("  Curve:", privateKey.algorithm.namedCurve);
        return true;
      } else {
        console.error("✗ Keys not found in IndexedDB");
        return false;
      }
    } catch (error) {
      console.error("✗ Test failed:", error);
      return false;
    }
  },

  /**
   * Test 2: Verify keys are non-extractable
   */
  async testNonExtractable() {
    console.log("\n=== Test 2: Non-Extractable Keys ===");
    try {
      await dpopManager.initialize();
      const keyPair = dpopManager.keyPair;

      // Try to export the private key (should fail)
      try {
        await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
        console.error("✗ SECURITY ISSUE: Private key is extractable!");
        return false;
      } catch (error) {
        console.log("✓ Private key is non-extractable (as expected)");
        console.log("  Error:", error.message);
      }

      // Public key should be exportable
      try {
        const publicJWK = await window.crypto.subtle.exportKey(
          "jwk",
          keyPair.publicKey,
        );
        console.log("✓ Public key is exportable (as expected)");
        console.log("  Public JWK:", publicJWK);
        return true;
      } catch (error) {
        console.error("✗ Public key should be exportable:", error);
        return false;
      }
    } catch (error) {
      console.error("✗ Test failed:", error);
      return false;
    }
  },

  /**
   * Test 3: Generate DPoP proof and verify structure
   */
  async testProofGeneration() {
    console.log("\n=== Test 3: DPoP Proof Generation ===");
    try {
      const testUrl = "https://example.com/api/test";
      const testMethod = "POST";
      const testToken = "test_access_token_12345";

      // Generate proof without access token
      const proof1 = await generateDpopProof(testUrl, testMethod);
      console.log("✓ DPoP proof generated (without access token)");

      // Decode and verify structure
      const parts1 = proof1.split(".");
      if (parts1.length !== 3) {
        console.error("✗ Invalid JWT structure");
        return false;
      }

      const header1 = JSON.parse(
        atob(parts1[0].replace(/-/g, "+").replace(/_/g, "/")),
      );
      const payload1 = JSON.parse(
        atob(parts1[1].replace(/-/g, "+").replace(/_/g, "/")),
      );

      console.log("  Header:", header1);
      console.log("  Payload:", payload1);

      // Verify header
      if (header1.typ !== "dpop+jwt") {
        console.error("✗ Invalid typ in header");
        return false;
      }
      if (header1.alg !== "ES256") {
        console.error("✗ Invalid alg in header");
        return false;
      }
      if (!header1.jwk) {
        console.error("✗ Missing jwk in header");
        return false;
      }
      console.log("✓ Header structure valid");

      // Verify payload
      if (!payload1.jti || !payload1.htm || !payload1.htu || !payload1.iat) {
        console.error("✗ Missing required claims in payload");
        return false;
      }
      if (payload1.htm !== testMethod) {
        console.error("✗ htm mismatch");
        return false;
      }
      console.log("✓ Payload structure valid");

      // Generate proof with access token
      const proof2 = await generateDpopProof(testUrl, testMethod, testToken);
      const parts2 = proof2.split(".");
      const payload2 = JSON.parse(
        atob(parts2[1].replace(/-/g, "+").replace(/_/g, "/")),
      );

      if (!payload2.ath) {
        console.error("✗ Missing ath claim when access token provided");
        return false;
      }
      console.log("✓ Access token hash (ath) included when token provided");

      return true;
    } catch (error) {
      console.error("✗ Test failed:", error);
      return false;
    }
  },

  /**
   * Test 4: Test key rotation
   */
  async testKeyRotation() {
    console.log("\n=== Test 4: Key Rotation ===");
    try {
      await dpopManager.initialize();
      const oldThumbprint = await getDpopKeyThumbprint();
      console.log("  Old key thumbprint:", oldThumbprint);

      await dpopManager.rotateKeys();
      console.log("✓ Keys rotated");

      const newThumbprint = await getDpopKeyThumbprint();
      console.log("  New key thumbprint:", newThumbprint);

      if (oldThumbprint === newThumbprint) {
        console.error("✗ Key rotation failed - thumbprints are the same");
        return false;
      }

      console.log("✓ Key rotation successful - new keys generated");
      return true;
    } catch (error) {
      console.error("✗ Test failed:", error);
      return false;
    }
  },

  /**
   * Test 5: Test key persistence across page reloads
   */
  async testKeyPersistence() {
    console.log("\n=== Test 5: Key Persistence ===");
    try {
      await dpopManager.initialize();
      const thumbprint1 = await getDpopKeyThumbprint();
      console.log("  Current key thumbprint:", thumbprint1);

      // Clear in-memory cache
      dpopManager.keyPair = null;
      console.log("  Cleared in-memory cache");

      // Re-initialize (should load from IndexedDB)
      await dpopManager.initialize();
      const thumbprint2 = await getDpopKeyThumbprint();
      console.log("  Reloaded key thumbprint:", thumbprint2);

      if (thumbprint1 !== thumbprint2) {
        console.error("✗ Key persistence failed - thumbprints don't match");
        return false;
      }

      console.log("✓ Keys persisted correctly in IndexedDB");
      return true;
    } catch (error) {
      console.error("✗ Test failed:", error);
      return false;
    }
  },

  /**
   * Test 6: Test cleanup
   */
  async testCleanup() {
    console.log("\n=== Test 6: Cleanup ===");
    try {
      await dpopManager.clearKeys();
      console.log("✓ Keys cleared");

      const db = await indexedDB.open("DPoPKeyStore", 1);
      const transaction = db.transaction(["keys"], "readonly");
      const store = transaction.objectStore("keys");

      const privateKeyRequest = store.get("dpop-private-key");
      const privateKey = await new Promise((resolve) => {
        privateKeyRequest.onsuccess = () => resolve(privateKeyRequest.result);
      });

      db.close();

      if (privateKey) {
        console.error("✗ Keys still exist after cleanup");
        return false;
      }

      console.log("✓ Keys successfully removed from IndexedDB");

      // Re-initialize to restore keys for further use
      await dpopManager.initialize();
      console.log("✓ New keys generated for continued use");

      return true;
    } catch (error) {
      console.error("✗ Test failed:", error);
      return false;
    }
  },

  /**
   * Run all tests
   */
  async runAll() {
    console.log("╔════════════════════════════════════════╗");
    console.log("║   DPoP Implementation Test Suite      ║");
    console.log("╚════════════════════════════════════════╝\n");

    const results = {
      keyStorage: await this.testKeyStorage(),
      nonExtractable: await this.testNonExtractable(),
      proofGeneration: await this.testProofGeneration(),
      keyRotation: await this.testKeyRotation(),
      keyPersistence: await this.testKeyPersistence(),
      cleanup: await this.testCleanup(),
    };

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║           Test Results                 ║");
    console.log("╚════════════════════════════════════════╝");

    const passed = Object.values(results).filter((r) => r).length;
    const total = Object.keys(results).length;

    Object.entries(results).forEach(([name, result]) => {
      const status = result ? "✓ PASS" : "✗ FAIL";
      console.log(`  ${status}: ${name}`);
    });

    console.log(`\nTotal: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log(
        "\n🎉 All tests passed! DPoP implementation is secure and functional.",
      );
    } else {
      console.log("\n⚠️ Some tests failed. Please review the implementation.");
    }

    return results;
  },
};

// Export for browser console access
if (typeof window !== "undefined") {
  window.DPoPTests = DPoPTests;
  console.log(
    "DPoP test utilities loaded. Run 'DPoPTests.runAll()' in console to test.",
  );
}

export default DPoPTests;
