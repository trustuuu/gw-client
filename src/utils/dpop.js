import dpopManager from "./DPoPManager.js";

/**
 * Generates or retrieves a DPoP key pair
 * Uses DPoPManager with IndexedDB and non-extractable keys.
 *
 * @returns {Promise<CryptoKeyPair>} The DPoP key pair
 */
export async function getDpopKeyPair() {
  await dpopManager.initialize();
  return dpopManager.keyPair;
}

/**
 * Generates a DPoP proof JWT
 *
 * Uses secure IndexedDB storage with non-extractable Web Crypto API keys.
 * Keys cannot be exported, providing protection against XSS attacks.
 *
 * @param {string} url - The full URL of the HTTP request
 * @param {string} method - The HTTP method (e.g., "POST", "GET")
 * @param {string} [accessToken] - Optional access token to bind (for resource requests)
 * @returns {Promise<string>} The DPoP proof JWT
 */
export async function generateDpopProof(url, method, accessToken = null) {
  return await dpopManager.createProof(method, url, accessToken);
}

/**
 * Clears the stored DPoP key pair (call on logout)
 * Removes keys from IndexedDB
 */
export async function clearDpopKeyPair() {
  await dpopManager.clearKeys();
}

/**
 * Rotate DPoP keys (generate new key pair)
 * Use this periodically or after security events
 * @returns {Promise<CryptoKeyPair>}
 */
export async function rotateDpopKeys() {
  return await dpopManager.rotateKeys();
}

/**
 * Get the JWK thumbprint of the current DPoP public key
 * This is used for debugging and validation
 * @returns {Promise<string>}
 */
export async function getDpopKeyThumbprint() {
  return await dpopManager.getJwkThumbprint();
}

// Export the manager for advanced use cases
export { dpopManager };
