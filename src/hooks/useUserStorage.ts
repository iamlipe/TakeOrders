import { useAsyncStorage } from './useAsyncStorage';
import { StorageKeys } from '@config/constants/storageKeys';
import { User } from '@store/slices/userSlice';

export function useUserStorage() {
  const storage = useAsyncStorage();

  async function save(key: StorageKeys, data: User) {
    await storage.save(key, JSON.stringify(data));
  }

  async function read(key: StorageKeys) {
    const data = await storage.read(key);

    return data ? JSON.parse(data) : null;
  }

  async function remove(key: StorageKeys) {
    await storage.remove(key);
  }

  async function saveUserLanguage(key: StorageKeys, language: string) {
    await storage.save(key, JSON.stringify(language));
  }

  async function getDidFirstAccessApp(key: StorageKeys) {
    await storage.save(key, JSON.stringify(true));
  }

  return {
    save,
    read,
    remove,
    saveUserLanguage,
    getDidFirstAccessApp,
  };
}
