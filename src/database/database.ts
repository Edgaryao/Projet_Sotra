import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync("sotra.db");
  
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS lignes (
      id INTEGER PRIMARY KEY NOT NULL,
      numero TEXT NOT NULL UNIQUE,
      nom TEXT
    );

    CREATE TABLE IF NOT EXISTS parcours (
      id INTEGER PRIMARY KEY NOT NULL,
      ligne_id INTEGER NOT NULL,
      nom TEXT NOT NULL UNIQUE,
      url_source TEXT,

      FOREIGN KEY (ligne_id)
        REFERENCES lignes(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS arrets (
      id INTEGER PRIMARY KEY NOT NULL,
      nom TEXT NOT NULL,
      latitude REAL,
      longitude REAL
    );

    CREATE TABLE IF NOT EXISTS parcours_arrets (
      id INTEGER PRIMARY KEY NOT NULL,
      parcours_id INTEGER NOT NULL,
      arret_id INTEGER NOT NULL,
      ordre INTEGER NOT NULL,

      FOREIGN KEY (parcours_id)
        REFERENCES parcours(id)
        ON DELETE CASCADE,

      FOREIGN KEY (arret_id)
        REFERENCES arrets(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS synchronisation (
      id INTEGER PRIMARY KEY NOT NULL,
      terminee INTEGER NOT NULL DEFAULT 0,
      lignes_ok INTEGER NOT NULL DEFAULT 0,
      parcours_ok INTEGER NOT NULL DEFAULT 0,
      arrets_ok INTEGER NOT NULL DEFAULT 0,
      parcours_arrets_ok INTEGER NOT NULL DEFAULT 0
    );
  `);

  return db;
}
