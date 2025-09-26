import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, eventTitle } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🎉 Thank You!</h2>
      <p>
        You're amazing, <strong>{user?.name || 'Friend'}</strong>. Your donation of{' '}
        <strong>₹{amount || '...'}</strong> to <strong>{eventTitle || 'this event'}</strong> is making a real difference.
      </p>
      <p>💡 Impact: That’s enough to provide meals for {amount ? Math.floor(amount / 25) : '...'} children.</p>

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        View My Dashboard
      </button>
    </div>
  );
}

export default ThankYou;