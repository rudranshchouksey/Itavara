export const getItem = async (key: string): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    // Native fallback could be added here later (e.g. AsyncStorage)
    return null;
  } catch (error) {
    console.warn('Failed to get item from storage:', error);
    return null;
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
    // Native fallback could be added here later (e.g. AsyncStorage)
  } catch (error) {
    console.warn('Failed to set item in storage:', error);
  }
};
