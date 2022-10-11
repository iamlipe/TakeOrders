export const storageKeys = {
  user: '@user',
  language: '@language',
};

export type StorageKeys = keyof typeof storageKeys;

export const rootKeys = { ...storageKeys };
