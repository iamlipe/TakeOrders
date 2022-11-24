export const storageKeys = {
  user: '@user',
  language: '@language',
  firstAccessApp: '@firstAccessApp',
};

export type StorageKeys = keyof typeof storageKeys;

export const rootKeys = { ...storageKeys };
