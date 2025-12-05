import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database will be stored in backend/db/event-scout.db
const dbDir = path.join(__dirname, "..", "db");
const dbPath = path.join(dbDir, "event-scout.db");

// Create db directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

export default db;
