import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalRequests: 0,
    pendingRequests: 0,
    myRequests: 0,
  });

  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const toggleAuditLogs = async () => {
    if (!showAuditLogs) {
      setAuditLoading(true);
      try {
        const response = await api.get('/api/inventory/audit-logs');
        const sortedLogs = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAuditLogs(sortedLogs);
        setShowAuditLogs(true);
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setAuditLoading(false);
      }
    } else {
      setShowAuditLogs(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');

      try {
        const inventoryResponse = await api.get('/api/inventory', {
          params: { page: 0, size: 1, sortBy: 'name' },
        });

        const totalItems = inventoryResponse.data?.totalElements ?? 0;
        let lowStock = 0;
        let totalRequests = 0;
        let pendingRequests = 0;
        let myRequests = 0;

        if (user?.role === 'ADMIN') {
          const lowResponse = await api.get('/api/inventory/low-stock');
          lowStock = Number(lowResponse.data?.length ?? 0);

          const allRequests = await api.get('/api/requests');
          totalRequests = Number(allRequests.data?.length ?? 0);
          pendingRequests = Number(
            allRequests.data?.filter((request) => request.status === 'PENDING')?.length ?? 0
          );
        } else {
          const myResponse = await api.get('/api/requests/my');
          myRequests = Number(myResponse.data?.length ?? 0);
          pendingRequests = Number(
            myResponse.data?.filter((request) => request.status === 'PENDING')?.length ?? 0
          );
        }

        setStats({ totalItems, lowStock, totalRequests, pendingRequests, myRequests });
      } catch (err) {
        setError('Unable to load dashboard stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.role]);

  return (
    <div className="page-card">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard Overview</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Inventory Items</div>
          <div className="stat-value">{stats.totalItems}</div>
        </div>

        {user?.role === 'ADMIN' ? (
          <>
            <div className="stat-card">
              <div className="stat-label">Low Stock Items</div>
              <div className="stat-value">{stats.lowStock}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{stats.totalRequests}</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-label">My Requests</div>
              <div className="stat-value">{stats.myRequests}</div>
            </div>
          </>
        )}

        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{stats.pendingRequests}</div>
        </div>
      </div>

      {loading && <div className="page-loading">Loading dashboard...</div>}

      {showAuditLogs && user?.role === 'ADMIN' && (
        <div style={{ marginTop: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Security & Audit Logs</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Changed By</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length ? (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(243, 107, 46, 0.2)', color: '#f36b2e', fontWeight: 'bold', fontSize: '0.8rem' }}>{log.action}</span></td>
                      <td>{log.itemId}</td>
                      <td>{log.itemName}</td>
                      <td>{log.changedBy}</td>
                      <td>{log.details}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-row">No audit logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {user?.role === 'ADMIN' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '50px' }}
            onClick={toggleAuditLogs} 
            disabled={auditLoading}
          >
            {auditLoading ? 'Loading Logs...' : (showAuditLogs ? 'Close Audit Logs' : 'Open Audit Logs Dashboard')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
