import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../api/adminApi';
import { toast } from 'react-toastify';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data || []);
      } catch (err) {
        toast.error('Failed to fetch users');
      }
    };
    loadUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(userId, token);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4">🧑‍💼 All Users</h4>

      {users.length === 0 ? (
        <div className="alert alert-warning">No users found.</div>
      ) : (
        <div className="row g-3">
          {users.map((u) => (
            <div className="col-md-4" key={u._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title mb-1">{u.name}</h5>
                  <p className="card-text text-muted mb-2">{u.email}</p>
                  <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                    {u.role}
                  </span>
                  <button
                    className="btn btn-sm btn-danger mt-3 px-3 py-1 d-flex align-items-center gap-2"
                    onClick={() => handleDelete(u._id)}
                  >
                    <i className="bi bi-trash-fill"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;