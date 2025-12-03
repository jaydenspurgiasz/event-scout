import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database will be stored in backend/db/event-scout.db
const dbPath = path.join(__dirname, "..", "db", "event-scout.db");
const db = new sqlite3.Database(dbPath);

export default db;
