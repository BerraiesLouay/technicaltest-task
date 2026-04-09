import dotenv from 'dotenv';
import { getDb } from '../db.js';
import type { TicketDTO } from '../dto/ticketsdto.js';

dotenv.config();

const BASE_URL = process.env.ZENDESK_BASE_URL;
const TOKEN = process.env.ZENDESK_OAUTH_TOKEN;
const USER_ID = process.env.TARGET_USER_ID;
const max_retries = 3;

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
    return JSON.parse(cachedRow.data) as TicketDTO[];

  }
  console.log('fetching updated data, timeout exceeded');
  const url = `${BASE_URL}/users/${USER_ID}/tickets/ccd.json?per_page=100`;
 for (let attempt = 1; attempt <= max_retries; attempt++) {
    try {
      console.log(`Fetching from Zendesk (Attempt ${attempt})...`);
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Zendesk API error: ${response.status}`);
      }
  const data = await response.json();
  const rawTickets = data.tickets || [];
  const tickets: TicketDTO[] = rawTickets.map((t: any) => ({
        id: t.id,
        status: t.status,
        subject: t.subject,
        priority: t.priority,
        created_at: t.created_at
      }));
  await db.run(
    'INSERT OR REPLACE INTO ticket_cache (id, data, last_fetched) VALUES (?, ?, ?)',
    ['cached_list', JSON.stringify(tickets), Date.now()]
  );

  return tickets;
} catch (error: unknown) {
  const errorMessage =
    error instanceof Error ? error.message : String(error);

  console.error(`Attempt ${attempt} failed: ${errorMessage}`);

  if (attempt === max_retries) {
    throw error instanceof Error ? error : new Error(errorMessage);
  }
}
}   
}
export async function removeUserFromCC(ticketId: string) {
  const url = `${BASE_URL}/tickets/${ticketId}.json`;
  const payload = {
    ticket: {
      email_ccs: [
        { user_id: USER_ID, action: "remove" }
      ]
    }
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const db = await getDb();
    await db.run('DELETE FROM ticket_cache WHERE id = ?', ['cc_tickets_cache']);
  }
  return response.ok;
}
export async function isGlobalLimitExceeded(db: any, timestamp: number): Promise<boolean> {
  const result = await db.get(
    'SELECT COUNT(*) as count FROM logs WHERE action = "remove_cc" AND timestamp > ?',
    [timestamp]
  );
  return result.count >= 3;
}

export async function isUserLimitExceeded(db: any, userId: string, timestamp: number): Promise<boolean> {
  const result = await db.get(
    'SELECT COUNT(*) as count FROM logs WHERE user_id = ? AND action = "remove_cc" AND timestamp > ?',
    [userId, timestamp]
  );
  return result.count >= 1;
}
export async function logging(userId: string) {
  const db = await getDb();
  await db.run(
    'INSERT INTO logs (user_id, action, timestamp) VALUES (?, ?, ?)',
    [userId, 'remove_cc', Date.now()]
  );
}