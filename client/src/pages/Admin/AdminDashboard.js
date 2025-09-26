import React, { useEffect, useState } from 'react';
import {
  getDonationStats,
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
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [donationTotal, setDonationTotal] = useState(0);
  const [funding, setFunding] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const d = await getDonationStats(token);
        const f = await getFundingStats(token);
        const s = await getSummaryStats(token);

        setDonationTotal(d.totalDonations || 0);
        setFunding(f || []);
        setSummary(s || {});
      } catch (err) {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [token]);

  const handleExport = () => {
    try {
      const csv = [
        ['Metric', 'Value'],
        ['Total Donations', summary.totalDonations],
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

      toast.success('📤 Stats exported successfully!');
    } catch {
      toast.error('Export failed');
    }
  };

  const fundingChart = {
    labels: funding.map((e) => e.title),
    datasets: [
      {
        label: 'Funding %',
        data: funding.map((e) => e.percent),
        backgroundColor: funding.map((e) =>
          e.percent >= 100 ? '#198754' : '#ffc107'
        ),
      },
    ],
  };

  const donationPie = {
    labels: ['Total Donations'],
    datasets: [
      {
        data: [donationTotal],
        backgroundColor: ['#6f42c1'],
      },
    ],
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container-fluid" style={{ marginLeft: '220px' }}>
        <div className="py-4">
          <h4 className="mb-3">📊 Admin Dashboard</h4>
          <p className="text-muted">Welcome, <strong>{user?.name}</strong> ({user?.role})</p>

          {user?.role !== 'admin' ? (
            <div className="alert alert-danger">Access denied.</div>
          ) : loading ? (
            <div className="text-center text-muted">Loading stats...</div>
          ) : (
            <>
              {summary && (
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                      <div className="card-body p-3">
                        <div className="fs-4">₹{summary.totalDonations}</div>
                        <small className="text-muted">Total Donations</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                      <div className="card-body p-3">
                        <div className="fs-4">{summary.totalEvents}</div>
                        <small className="text-muted">Events</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                      <div className="card-body p-3">
                        <div className="fs-4">{summary.totalUsers}</div>
                        <small className="text-muted">Users</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-outline-primary" onClick={handleExport}>
                  📤 Export CSV
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-header">💰 Funding Progress</div>
                    <div className="card-body">
                      {funding.length > 0 ? (
                        <Bar data={fundingChart} />
                      ) : (
                        <div className="text-muted">No funding data available.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-header">🎯 Donation Overview</div>
                    <div className="card-body">
                      <Pie data={donationPie} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;