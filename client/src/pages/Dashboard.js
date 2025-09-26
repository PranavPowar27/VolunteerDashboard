import React, { useEffect, useState } from 'react';
import { getMyDonations } from '../api/donationApi';

function Dashboard() {
  const [donations, setDonations] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMyDonations(token);
        console.log('Fetched donations:', data);
        setDonations(data);
      } catch (err) {
        console.error('Error loading donation history:', err);
        alert('Failed to load donation history');
      }
    };
    loadData();
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, 👋 {user?.name}</h2>
      <p>Your role: <strong>{user?.role}</strong></p>

      <section style={{ marginTop: '2rem' }}>
        <h3>Donation History</h3>
        {donations.length === 0 ? (
          <p>You haven’t made any donations yet.</p>
        ) : (
          <ul>
            {donations.map((d, index) => (
              <li
                key={`${d._id}-${d.transactionId || index}`} // ✅ Composite key to ensure uniqueness
                style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              >
                <h4>{d.event?.title || 'Event'}</h4>
                <p><strong>Date:</strong> {new Date(d.event?.date).toLocaleDateString()}</p>
                <p><strong>Amount:</strong> ₹{d.amount}</p>
                <p><strong>Transaction ID:</strong> {d.transactionId || 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard;