import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchCCdTickets, isUserLimitExceeded, isGlobalLimitExceeded, logging, removeUserFromCC } from './services/zendeskService.js';
import { getDb } from './db.js';

dotenv.config();  

const app = express();
const PORT = process.env.PORT;
const TARGET_USER_ID = process.env.TARGET_USER_ID;
const corsOptions = {
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await fetchCCdTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.post('/api/tickets/:id/remove', async (req, res) => {
  const { id } = req.params;

  if (!TARGET_USER_ID) {
    return res.status(500).json({ error: 'Server configuration error: TARGET_USER_ID missing' });
  }

  try {
    const db = await getDb();
    const globalExceeded = await isGlobalLimitExceeded(db, 60000);
    if (globalExceeded) {
      return res.status(429).json({ error: 'Global rate limit reached (3/min)' });
    }

    const userExceeded = await isUserLimitExceeded(db, TARGET_USER_ID, 60000);
    if (userExceeded) {
      return res.status(429).json({ error: 'User rate limit reached (1/min)' });
    }

    const success = await removeUserFromCC(id);
    
    if (success) {
      await logging(TARGET_USER_ID);
      return res.json({ message: 'User successfully removed from CC' });
    } else {
      return res.status(400).json({ error: 'Zendesk update failed' });
    }

  } catch (error) {
    console.error('Removal Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
export default app;

