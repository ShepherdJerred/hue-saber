import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

let db;

export function initialize() {
  db = low(FileSync('db.json'));
}

export function get(key) {
  db.get(key).value();
}

export function set(key, value) {
  db.set(key, value).write();
}

