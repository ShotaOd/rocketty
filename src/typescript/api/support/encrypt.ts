// secure
import * as CryptoJS from "crypto-js";
import {CipherOption} from "crypto-js";
import {passphrase} from "../../Property";
import {Base64} from 'js-base64';
const BLOCK_SIZE = 128 / 8;

const getOption = (): CipherOption => ({
  iv: CryptoJS.lib.WordArray.random(BLOCK_SIZE),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  keySize: 16,
});

const getKey = () => {
  return CryptoJS.enc.Utf8.parse(passphrase);
  //return CryptoJS.lib.WordArray.random(BLOCK_SIZE);
  //const salt = CryptoJS.lib.WordArray.random(128 / 8);
  //return CryptoJS.PBKDF2(passphrase, salt, {keySize: 128 / 8, iterations: 500 });
};

const encoder = {
  stringify: (crypt: any) => {
    const {
      iv,
      ciphertext,
    } = crypt;
    const enc = CryptoJS.enc.Hex;
    const enc_iv = iv.toString(enc);
    const enc_cipher = ciphertext.toString(enc);
    return Base64.encode(`${enc_iv}_${enc_cipher}`);
  },
  parse: () => null,
};

export const encrypt = (text: string): string => {
  const wordArray = CryptoJS.AES.encrypt(text, getKey(), getOption());
  return wordArray.toString(encoder);
};
