import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchCCdTickets } from './zendeskService.js';

dotenv.config();  

const app = express();
const PORT = process.env.PORT;
const TARGET_USER_ID = process.env.TARGET_USER_ID;
app.use(cors());
app.use(express.json());

app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await fetchCCdTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});


app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));

