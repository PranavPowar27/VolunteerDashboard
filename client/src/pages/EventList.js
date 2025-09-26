import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/eventApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EventList() {
  const [events, setEvents] = useState([]);
  const [donationInputs, setDonationInputs] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        toast.error('Error loading events');
      }
    };
    loadEvents();
  }, []);

  const handleInputChange = (e, eventId) => {
    setDonationInputs((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleDonate = async (eventId) => {
    const input = donationInputs[eventId];
    if (!input || !input.amount || !input.method) {
      toast.warning('Please fill in all donation fields');
      return;
    }

    if (input.method === 'Cash') {
      try {
        const res = await fetch('/api/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(input.amount),
            method: input.method,
            message: input.message || '',
            event: eventId,
          }),
        });

        if (!res.ok) throw new Error('Donation failed');
        toast.success('🎉 Donation successful!');
        navigate('/thank-you', {
          state: {
            amount: input.amount,
            eventTitle: events.find((e) => e._id === eventId)?.title || '',
          },
        });
      } catch (err) {
        toast.error(err.message);
      }
      return;
    }

    // Razorpay flow for UPI
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: input.amount }),
      });

      const orderData = await orderRes.json();

      const options = {
        key: 'rzp_test_RMGGXAYDDfBe9E', // Replace with your actual key
        amount: orderData.amount,
        currency: 'INR',
        name: 'Volunteer Donation Manager',
        description: 'Event Donation',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const res = await fetch('/api/donations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                amount: Number(input.amount),
                method: input.method,
                message: input.message || '',
                event: eventId,
                transactionId: response.razorpay_payment_id,
              }),
            });

            if (!res.ok) throw new Error('Donation failed');
            toast.success('🎉 Payment successful!');
            navigate('/thank-you', {
              state: {
                amount: input.amount,
                eventTitle: events.find((e) => e._id === eventId)?.title || '',
              },
            });
          } catch (err) {
            toast.error(err.message);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment initiation failed');
    }
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4">🎪 All Events</h4>
      {events.length === 0 ? (
        <div className="alert alert-warning">No events found.</div>
      ) : (
        <div className="row g-4">
          {events.map((event) => {
            const progress = Math.min(
              (event.currentAmount / event.goalAmount) * 100,
              100
            );
            const input = donationInputs[event._id] || {};

            return (
              <div className="col-md-6" key={event._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="text-muted">{event.description}</p>
                    <ul className="list-unstyled small mb-2">
                      <li><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</li>
                      <li><strong>Goal:</strong> ₹{event.goalAmount}</li>
                      <li><strong>Raised:</strong> ₹{event.currentAmount}</li>
                    </ul>

                    <div className="progress mb-2" style={{ height: '10px' }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="small text-muted">{Math.floor(progress)}% funded</p>

                    {progress >= 100 ? (
                      <p className="text-success fw-bold">🎉 Fully Funded!</p>
                    ) : (
                      <form
                        className="d-grid gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleDonate(event._id);
                        }}
                      >
                        <input
                          type="number"
                          name="amount"
                          className="form-control"
                          placeholder="Amount"
                          value={input.amount || ''}
                          onChange={(e) => handleInputChange(e, event._id)}
                        />
                        <select
                          name="method"
                          className="form-select"
                          value={input.method || ''}
                          onChange={(e) => handleInputChange(e, event._id)}
                        >
                          <option value="">Select Method</option>
                          <option value="UPI">UPI</option>
                          <option value="Card">Card</option>
                          <option value="Cash">Cash</option>
                        </select>
                        <input
                          type="text"
                          name="message"
                          className="form-control"
                          placeholder="Message (optional)"
                          value={input.message || ''}
                          onChange={(e) => handleInputChange(e, event._id)}
                        />
                        <button type="submit" className="btn btn-primary">
                          Donate
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EventList;