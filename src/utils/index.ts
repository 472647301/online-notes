import AsyncStorage from '@react-native-community/async-storage';

export const cookies = {
  /**
   * 加载
   */
  load: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
      return '';
    } catch (e) {
      return '';
    }
  },
  /**
   * 存储
   */
  save: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
      return value;
    } catch (e) {
      return '';
    }
  },
};
