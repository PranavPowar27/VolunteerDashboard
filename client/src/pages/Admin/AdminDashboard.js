import React, { useEffect, useState } from 'react';
import {
  getDonationStats,
  getVolunteerStats,
  getFundingStats,
  getSummaryStats,
} from '../../api/adminApi';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import AdminSidebar from '../../components/AdminSidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [donationTotal, setDonationTotal] = useState(0);
  const [volunteers, setVolunteers] = useState([]);
  const [funding, setFunding] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const d = await getDonationStats(token);
        const v = await getVolunteerStats(token);
        const f = await getFundingStats(token);
        const s = await getSummaryStats(token);

        setDonationTotal(d.totalDonations || 0);
        setVolunteers(v || []);
        setFunding(f || []);
        setSummary(s || {});
      } catch (err) {
        console.error('Failed to load admin stats:', err.message);
        alert('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [token]);

  const handleExport = () => {
    const csv = [
      ['Metric', 'Value'],
      ['Total Donations', summary.totalDonations],
      ['Volunteers', summary.totalVolunteers],
      ['Events', summary.totalEvents],
      ['Users', summary.totalUsers],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin_stats.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const volunteerChart = {
    labels: volunteers.map((v) => v.title),
    datasets: [
      {
        label: 'Volunteers per Event',
        data: volunteers.map((v) => v.volunteerCount),
        backgroundColor: '#42a5f5',
      },
    ],
  };

  const fundingChart = {
    labels: funding.map((e) => e.title),
    datasets: [
      {
        label: 'Funding %',
        data: funding.map((e) => e.percent),
        backgroundColor: funding.map((e) =>
          e.percent >= 100 ? '#66bb6a' : '#ffa726'
        ),
      },
    ],
  };

  const donationPie = {
    labels: ['Total Donations'],
    datasets: [
      {
        data: [donationTotal],
        backgroundColor: ['#ab47bc'],
      },
    ],
  };

  const cardStyle = {
    flex: 1,
    background: '#f5f5f5',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1.2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  };

  const cardHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  };

  const renderCard = (icon, value, label, index) => (
    <div
      style={{
        ...cardStyle,
        ...(hoveredCard === index ? cardHoverStyle : {}),
      }}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={() => alert(`Clicked on ${label}`)}
    >
      {icon}<br />{value}<br /><small>{label}</small>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />

      <div style={{ marginLeft: '220px', padding: '2rem', width: '100%' }}>
        <h2>📊 Admin Dashboard</h2>
        <p><strong>Welcome:</strong> {user?.name} ({user?.role})</p>

        {user?.role !== 'admin' ? (
          <p>You do not have access to admin tools.</p>
        ) : loading ? (
          <p>Loading stats...</p>
        ) : (
          <>
            {summary && (
              <>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  {renderCard('💰', `₹${summary.totalDonations}`, 'Total Donations', 0)}
                  {renderCard('👥', summary.totalVolunteers, 'Volunteers', 1)}
                  {renderCard('📅', summary.totalEvents, 'Events', 2)}
                  {renderCard('🧑‍💼', summary.totalUsers, 'Users', 3)}
                </div>

                <button onClick={handleExport} style={{
                  marginBottom: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  📤 Export Stats to CSV
                </button>
              </>
            )}

            <hr />
            <h3>👥 Volunteer Stats</h3>
            {volunteers.length > 0 ? (
              <div style={{ maxWidth: '600px' }}>
                <Bar data={volunteerChart} />
              </div>
            ) : (
              <p>No volunteer data available.</p>
            )}

            <hr />
            <h3>💰 Funding Progress</h3>
            {funding.length > 0 ? (
              <div style={{ maxWidth: '600px' }}>
                <Bar data={fundingChart} />
              </div>
            ) : (
              <p>No funding data available.</p>
            )}

            <hr />
            <h3>🎯 Donation Overview</h3>
            <div style={{ maxWidth: '300px' }}>
              <Pie data={donationPie} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;