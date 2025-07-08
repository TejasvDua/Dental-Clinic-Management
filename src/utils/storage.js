export const STORAGE_KEYS = {
  USERS: 'dental_clinic_users',
  PATIENTS: 'dental_clinic_patients',
  INCIDENTS: 'dental_clinic_incidents',
  CURRENT_USER: 'dental_clinic_current_user'
};

export const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting storage data:', error);
    return null;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error setting storage data:', error);
    return false;
  }
};

export const removeStorageData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing storage data:', error);
    return false;
  }
};

export const initializeStorage = (mockData) => {
  const users = getStorageData(STORAGE_KEYS.USERS);
  const patients = getStorageData(STORAGE_KEYS.PATIENTS);
  const incidents = getStorageData(STORAGE_KEYS.INCIDENTS);

  if (!users) {
    setStorageData(STORAGE_KEYS.USERS, mockData.users);
  }
  if (!patients) {
    setStorageData(STORAGE_KEYS.PATIENTS, mockData.patients);
  }
  if (!incidents) {
    setStorageData(STORAGE_KEYS.INCIDENTS, mockData.incidents);
  }
};

export const generateId = (prefix = 'ID') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};