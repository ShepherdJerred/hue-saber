import WebSocket from 'ws';
import * as hue from 'node-hue-api';
import * as dotenv from 'dotenv';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

dotenv.config();
const adapter = new FileSync('db.json');

