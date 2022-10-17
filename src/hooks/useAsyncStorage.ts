import AsyncStorage from '@react-native-async-storage/async-storage';

import { rootKeys, StorageKeys } from '@config/constants/storageKeys';

export function useAsyncStorage() {
  async function save(key: StorageKeys, data: string) {
    await AsyncStorage.setItem(rootKeys[key], data);
  }

  async function read(key: StorageKeys) {
    return await AsyncStorage.getItem(rootKeys[key]);
  }

  async function remove(key: StorageKeys) {
    await AsyncStorage.removeItem(rootKeys[key]);
  }

  return { save, read, remove };
}
