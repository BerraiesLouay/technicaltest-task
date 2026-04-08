import { useEffect, useState } from 'react';
import TicketCard from './components/TicketCard';
import './App.css';

export default function App() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);


  return (
    <div className="app-container">
      <h1 className="ticket-subject">Zendesk CC Dashboard</h1>      
      {loading && <p>Loading tickets from server...</p>}
      
      {!loading && tickets.length > 0 && (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket}
            />
          ))}
        </div>
      )}

      {!loading && tickets.length === 0 && (
        <p>No tickets found. Check backend terminal!</p>
      )}
    </div>
  );
}