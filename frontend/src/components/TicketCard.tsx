import '../styles/App.css';
import '../styles/index.css';
import DeleteBtn from './DeleteButton';

export default function TicketCard({ ticket, onClick, onRefresh }: any) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-header">
        <span className="ticket-id">#{ticket.id}</span>
        <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
        <DeleteBtn ticketId={ticket.id} onSuccess={onRefresh} />
      </div>
      <h3 className="ticket-subject">{ticket.subject}</h3>
      <div className="ticket-meta">
        <span className="priority">Priority: {ticket.priority}</span>
        <span className="created">Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}