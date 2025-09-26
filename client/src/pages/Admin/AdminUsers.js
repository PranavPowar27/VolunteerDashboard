import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../api/adminApi';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data || []);
      } catch (err) {
        console.error('Failed to fetch users:', err.message);
      }
    };
    loadUsers();
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🧑‍💼 All Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} ({u.email}) — <strong>{u.role}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;