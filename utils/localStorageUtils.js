// utils/localStorageUtils.js

export const getStoredItem = (key) => {
  const storedItem = localStorage.getItem(key);
  return storedItem ? JSON.parse(storedItem) : null;
};

export const setStoredItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
