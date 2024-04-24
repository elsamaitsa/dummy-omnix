const CryptoJS = window.CryptoJS;
export const decrypt = (str) => {
  const dec = CryptoJS.AES.decrypt(
    str,
    CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );
  return dec.toString(CryptoJS.enc.Utf8);
};
export const encrypt = (str) => {
  const enc = CryptoJS.AES.encrypt(
    str,
    CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(process.env.IV_KEY), // parse the IV
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );
  return enc.toString();
};
export const getStorage = (name, isJson) => {
  const isEncrypt = process.env.IS_ENCRYPT;
  const storage = localStorage.getItem(name);
  if (parseInt(isEncrypt) === 1) {
    if (storage) {
      if (isJson) {
        return JSON.parse(decrypt(storage));
      } else {
        return decrypt(storage);
      }
    }
  } else {
    if (storage) {
      if (isJson) {
        return JSON.parse(storage);
      } else {
        return storage;
      }
    }
  }
  return null;
};
export const setStorage = (name, value, isJson) => {
  const isEncrypt = process.env.IS_ENCRYPT;
  if (parseInt(isEncrypt) === 1) {
    if (isJson) {
      return localStorage.setItem(name, encrypt(JSON.stringify(value)));
    } else {
      return localStorage.setItem(name, encrypt(value));
    }
  } else {
    if (isJson) {
      return localStorage.setItem(name, JSON.stringify(value));
    } else {
      return localStorage.setItem(name, value);
    }
  }
};
