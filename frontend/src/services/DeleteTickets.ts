export async function deleteTicketCC(ticketId: string | number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/remove-cc`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Service Error [DeleteTickets]:", error);
    throw error;
  }
}