import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

function AnalyticsPage() {
  useEffect(() => {
    toast.info('Analytics module is under development');
  }, []);

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">📈 Analytics Overview</h4>
          <p className="card-text text-muted">
            This page will show donation stats, volunteer activity, and event performance.
          </p>
          <div className="alert alert-info mt-3">
            Analytics modules coming soon — stay tuned!
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;