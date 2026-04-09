import React, { useState } from 'react';

interface DeleteButtonProps {
  onDelete: () => void;
}

export default function DeleteButton({ onDelete }: DeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isConfirming) {
      onDelete();
    } else {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000);
    }
  };

  return (
    <button 
      className={`delete-btn ${isConfirming ? 'confirming' : ''}`} 
      onClick={handleClick}
      title={isConfirming ? "Click again to confirm" : "Delete ticket"}
    >
      {isConfirming ? (
        <span className="btn-text">Confirm?</span>
      ) : (
        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}