import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, eventTitle } = location.state || {};
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    toast.success('🎉 Thank you for your donation!');
  }, []);

  return (
    <div className="container py-5 text-center">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h2 className="mb-3 text-success">🎉 Thank You!</h2>
        <p>
          You're amazing, <strong>{user?.name || 'Friend'}</strong>. Your donation of{' '}
          <strong>₹{amount || '...'}</strong> to <strong>{eventTitle || 'this event'}</strong> is making a real difference.
        </p>
        <p className="text-muted">
          💡 Impact: That’s enough to provide meals for {amount ? Math.floor(amount / 25) : '...'} children.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-success mt-3"
        >
          View My Dashboard
        </button>
      </div>
    </div>
  );
}

export default ThankYou;