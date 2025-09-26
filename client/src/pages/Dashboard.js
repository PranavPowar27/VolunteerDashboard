import React, { useEffect, useState } from 'react';
import { getMyDonations } from '../api/donationApi';
import { toast } from 'react-toastify';

function Dashboard() {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('All');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMyDonations(token);
        setDonations(data);
        setFilteredDonations(data);
      } catch (err) {
        toast.error('Failed to load donation history');
      }
    };
    loadData();
  }, [token]);

  const eventTitles = [
    'All',
    ...new Set(donations.map((d) => d.event?.title).filter(Boolean)),
  ];

  const handleEventChange = (e) => {
    const title = e.target.value;
    setSelectedEvent(title);
    if (title === 'All') {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(donations.filter((d) => d.event?.title === title));
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h4 className="text-primary">Welcome, 👋 {user?.name}</h4>
        <p className="text-muted">Your role: <strong>{user?.role}</strong></p>
      </div>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">🧾 Donation History</h5>
          <select
            className="form-select w-auto"
            value={selectedEvent}
            onChange={handleEventChange}
          >
            {eventTitles.map((title, idx) => (
              <option key={idx} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="alert alert-warning">No donations found for this event.</div>
        ) : (
          <div className="row g-3">
            {filteredDonations.map((d, index) => (
              <div className="col-md-6" key={`${d._id}-${d.transactionId || index}`}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">{d.event?.title || 'Event'}</h6>
                    <ul className="list-unstyled small mb-2">
                      <li><strong>Event Date:</strong> {new Date(d.event?.date).toLocaleDateString()}</li>
                      <li><strong>Donated On:</strong> {new Date(d.createdAt).toLocaleDateString()}</li>
                      <li><strong>Amount:</strong> <span className="badge bg-success">₹{d.amount}</span></li>
                      <li><strong>Transaction ID:</strong> <code>{d.transactionId || 'N/A'}</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;