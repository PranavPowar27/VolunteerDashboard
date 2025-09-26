import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        if (!user || user.role !== 'admin') {
          toast.error('Access denied: Admins only');
          return;
        }

        const res = await axios.get('/api/donations/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDonations(res.data);
      } catch (err) {
        toast.error('Failed to load donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [token, user]);

  return (
    <div className="container py-4">
      <h4 className="mb-4">🧾 All Donations</h4>

      {loading ? (
        <div className="text-muted">Loading donations...</div>
      ) : donations.length === 0 ? (
        <div className="alert alert-warning">No donations found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark sticky-top">
              <tr>
                <th scope="col">Donor</th>
                <th scope="col">Email</th>
                <th scope="col">Event</th>
                <th scope="col">Amount</th>
                <th scope="col">Date</th>
                <th scope="col">Message</th>
                <th scope="col">Txn ID</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id}>
                  <td><strong>{d.donor?.name || 'Unknown'}</strong></td>
                  <td className="text-muted">{d.donor?.email || '—'}</td>
                  <td>{d.event?.title || '—'}</td>
                  <td><span className="badge bg-success">₹{d.amount}</span></td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>{d.message || <span className="text-muted">—</span>}</td>
                  <td><code>{d.transactionId || '—'}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDonations;