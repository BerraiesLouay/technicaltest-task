import React, { useState } from 'react';
import { deleteTicketCC } from '../services/DeleteTickets';



export default function DeleteBtn({ ticketId, onSuccess }: any) {
  const [ld, setLd] = useState(false);

  const click = async (e: any) => {
    e.stopPropagation();
    if (window.confirm("Remove?") && !ld) {
      setLd(true);
      try { (await deleteTicketCC(ticketId)) && onSuccess(); } 
      catch (err: any) { alert(err.message); } 
      finally { setLd(false); }
    }
  };

  return <button onClick={click} disabled={ld}>{ld ? "..." : "🗑"}</button>;
}