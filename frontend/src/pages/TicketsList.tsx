import TicketCard from '../components/TicketCard';
import { useTickets } from '../services/DisplayTickets';
import '../styles/App.css';

export default function TicketDashboard() {
  const { tickets, loading, error } = useTickets();

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="app-container">
      <h1 className="ticket-subject">Zendesk CC Dashboard</h1>      
      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}