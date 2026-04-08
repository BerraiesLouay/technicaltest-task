import dotenv from 'dotenv';
import { getDb } from './db.js';

dotenv.config();

const BASE_URL = process.env.ZENDESK_BASE_URL;
const TOKEN = process.env.ZENDESK_OAUTH_TOKEN;
const USER_ID = process.env.TARGET_USER_ID;

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

export async function fetchCCdTickets() {
  const db = await getDb();
  const cacheLimit = 120000;

  const cachedRow = await db.get(
    'SELECT data, last_fetched FROM ticket_cache WHERE id = ?',
    ['cached_list']
  );

  if (cachedRow && (Date.now() - cachedRow.last_fetched < cacheLimit)) {
    console.log('Data is still fresh, returning from cache');
    return JSON.parse(cachedRow.data);
  }
  console.log('fetching updated data, timeout exceeded');
  const url = `${BASE_URL}/users/${USER_ID}/tickets/ccd.json`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Zendesk API error: ${response.status}`);
  }
  const data = await response.json();
  const tickets = Array.isArray(data) ? data : (data.tickets || []);
  await db.run(
    'INSERT OR REPLACE INTO ticket_cache (id, data, last_fetched) VALUES (?, ?, ?)',
    ['cached_list', JSON.stringify(tickets), Date.now()]
  );

  return tickets;
}