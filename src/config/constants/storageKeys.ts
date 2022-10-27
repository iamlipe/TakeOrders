export const storageKeys = {
  user: '@user',
  language: '@language',
  firstAccessApp: '@firstAccessApp',
  firstAccessAccount: '@firstAccessAccount',
};

export type StorageKeys = keyof typeof storageKeys;

export const rootKeys = { ...storageKeys };
