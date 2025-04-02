import resolveConfig from "tailwindcss/resolveConfig";

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig("./src/css/tailwind.config.js");
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const generateId = (id) => {
  const reg = new RegExp(`.{1,${id.length}}`);
  let guid = URL.createObjectURL(new Blob([])).slice(-36);
  return guid.replace(reg, id);
};

export const encodeClientCredentials = (clientId, clientSecret) => {
  return btoa(
    encodeURIComponent(clientId) + ":" + encodeURIComponent(clientSecret)
  );
};

function arrayBufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

async function getCryptoKey(password) {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(password);
  return crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
}

async function deriveKey(password, salt) {
  const keyMaterial = await getCryptoKey(password);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(text, password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoder.encode(text)
  );

  return {
    cipherText: arrayBufferToHex(encrypted),
    iv: arrayBufferToHex(iv),
    salt: arrayBufferToHex(salt),
  };
}

export async function decryptText(encryptedData, password) {
  const { cipherText, iv, salt } = encryptedData;
  const key = await deriveKey(password, hexToArrayBuffer(salt));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: hexToArrayBuffer(iv) },
    key,
    hexToArrayBuffer(cipherText)
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export function parseQuery(encrypedParams) {
  return {
    cipherText: encrypedParams.get("d"),
    iv: encrypedParams.get("i"),
    salt: encrypedParams.get("s"),
  };
}
