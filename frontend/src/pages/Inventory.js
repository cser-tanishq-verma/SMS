import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Inventory.css';
import { useAuth } from '../context/AuthContext';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const url = search ? '/api/inventory/search' : '/api/inventory';
      const response = search
        ? await api.get(url, { params: { keyword: search } })
        : await api.get(url, { params: { page, size, sortBy: 'name' } });

      if (search) {
        setItems(response.data || []);
        setTotal(response.data?.length ?? 0);
      } else {
        setItems(response.data?.content || []);
        setTotal(response.data?.totalElements ?? 0);
      }
    } catch (err) {
      setError('Failed to load inventory.');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [page, size]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadItems();
  };

  const { user } = useAuth();

  return (
    <div className="page-card">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Inventory Catalog</h1>
        <p className="page-subtitle">Browse stationery items below.</p>
      </div>



      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Min Qty</th>
                <th>Unit</th>
                <th>Description</th>
                {user?.role === 'ADMIN' && <th>Actions</th>}
              </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.availableQuantity}</td>
                  <td>{item.minimumQuantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.description || '—'}</td>
                  {user?.role === 'ADMIN' ? (
                    <td>
                      <Link to={`/inventory/edit/${item.id}`} className="action-link">
                        Edit
                      </Link>
                    </td>
                  ) : (
                    <td>—</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-row">
                  {loading ? 'Loading items...' : 'No items found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!search && (
        <div className="pagination-controls" style={{ justifyContent: 'center', marginTop: '2rem' }}>
          <button
            className="pagination-btn"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            style={{ borderRadius: '50px' }}
          >
            &larr; Previous
          </button>
          <span style={{ fontWeight: '600' }}>
            Page {page + 1} • {total} items
          </span>
          <button
            className="pagination-btn"
            disabled={(page + 1) * size >= total}
            onClick={() => setPage((prev) => prev + 1)}
            style={{ borderRadius: '50px' }}
          >
            Next &rarr;
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
        <form className="page-search" onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Search items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-search"
            style={{ flex: 1, borderRadius: '50px' }}
          />
          <button type="submit" className="btn btn-secondary" style={{ borderRadius: '50px', padding: '0 2rem' }}>
            Search
          </button>
        </form>

        {user?.role === 'ADMIN' && (
          <Link to="/inventory/add" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '50px', marginTop: '1rem', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
            + Add New Stationery Item
          </Link>
        )}
      </div>
    </div>
  );
};

export default Inventory;
