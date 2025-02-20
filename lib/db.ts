import { openDB } from "idb";

const DB_NAME = "QuizApp";
const STORE_NAME = "attempts";

export async function saveAttempt(score: number, total: number) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });

  await db.add(STORE_NAME, { score, total, date: new Date().toISOString() });
}

export async function getAttempts() {
  const db = await openDB(DB_NAME, 1);
  return await db.getAll(STORE_NAME);
}
