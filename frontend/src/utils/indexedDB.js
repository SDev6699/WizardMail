import { openDB } from 'idb';

const DB_NAME = 'emailsDB';
const STORE_NAME = 'emails';
const DB_VERSION = 1;

// Open the database
const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: '_id' });
      }
    },
  });
  return db;
};

// Save emails to IndexedDB
export const saveEmails = async (emails) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const email of emails) {
    store.put(email);
  }
  await tx.done;
};

// Get emails from IndexedDB
export const getEmails = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const allEmails = await store.getAll();
  await tx.done;
  return allEmails;
};

// Get email by ID from IndexedDB
export const getEmailById = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const email = await store.get(id);
  await tx.done;
  return email;
};

// Clear all emails from IndexedDB
export const clearEmails = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  await tx.done;
};

