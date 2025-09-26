import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css'; // Optional: for styling

function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        if (!user || user.role !== 'admin') {
          alert('Access denied: Admins only');
          return;
        }

        const res = await axios.get('/api/donations/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDonations(res.data);
      } catch (err) {
        console.error('Error fetching donations:', err.message);
        alert('Failed to load donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [token, user]);

  return (
    <div className="admin-container">
      <h2>🧾 All Donations</h2>

      {loading ? (
        <p>Loading donations...</p>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Email</th>
              <th>Event</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Message</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d._id}>
                <td>{d.donor?.name || 'Unknown'}</td>
                <td>{d.donor?.email || '—'}</td>
                <td>{d.event?.title || '—'}</td>
                <td>₹{d.amount}</td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td>{d.message || '—'}</td>
                <td>{d.transactionId || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDonations;