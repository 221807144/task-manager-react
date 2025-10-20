import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    phone: "",
    studentNumber: "",
    idNumber: "",
    active: true
  });

  const API_BASE = "http://localhost:8080/TaskManagement/TaskManagement/user";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/getAll`);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name || "",
      surname: user.surname || "",
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      studentNumber: user.studentNumber || "",
      idNumber: user.idNumber || "",
      active: user.active !== false
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateUser = async (userId) => {
    try {
      const userData = {
        id: userId,
        name: editForm.name,
        surname: editForm.surname,
        email: editForm.email,
        username: editForm.username,
        phone: editForm.phone,
        studentNumber: editForm.studentNumber,
        idNumber: editForm.idNumber
      };

      await axios.put(`${API_BASE}/update`, userData);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...editForm } : user
      ));
      setEditingUser(null);
      alert("User updated successfully!");
    } catch (err) {
      setError("Failed to update user. Please try again.");
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/delete/${userId}`);
      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // Since your backend doesn't have a toggle status endpoint for users,
      // we'll update the user with the new status
      const user = users.find(u => u.id === userId);
      const updatedUser = {
        ...user,
        active: !currentStatus
      };

      await axios.put(`${API_BASE}/update`, updatedUser);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: !currentStatus } : user
      ));
      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      setError("Failed to update user status. Please try again.");
      console.error("Error toggling user status:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      name: "",
      surname: "",
      email: "",
      username: "",
      phone: "",
      studentNumber: "",
      idNumber: "",
      active: true
    });
  };

  if (loading) {
    return (
      <div className="user-management-loading container py-5 text-center">
        <div className="loading-spinner spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="loading-text mt-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management-container container py-4">
      <div className="management-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="management-title mb-1">User Management</h2>
          <p className="management-subtitle text-muted">Manage all system users</p>
        </div>
        <button className="back-button btn btn-outline-secondary" onClick={onBack}>
          <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="error-alert alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="alert-close btn-close" 
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <div className="search-card card mb-4">
        <div className="card-body">
          <div className="search-row row">
            <div className="search-input col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="search-field form-control"
                  placeholder="Search users by name, email, or student number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button btn btn-outline-secondary" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            <div className="refresh-button col-md-6 text-end">
              <button 
                className="refresh-btn btn btn-primary"
                onClick={fetchUsers}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="users-table-card card">
        <div className="card-header">
          <h5 className="table-title card-title mb-0">
            Users ({filteredUsers.length})
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-container table-responsive">
            <table className="users-table table table-hover mb-0">
              <thead className="table-header table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Student No.</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-users text-center py-4">
                      <div className="no-users-content text-muted">
                        <i className="bi bi-people display-4 d-block mb-2"></i>
                        No users found
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="user-row">
                      <td className="user-id">
                        <small className="id-text text-muted">#{user.id}</small>
                      </td>
                      <td className="user-name">
                        {editingUser === user.id ? (
                          <div className="edit-name-fields row g-2">
                            <div className="name-edit col-6">
                              <input
                                type="text"
                                className="name-field form-control form-control-sm"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                placeholder="Name"
                              />
                            </div>
                            <div className="surname-edit col-6">
                              <input
                                type="text"
                                className="surname-field form-control form-control-sm"
                                name="surname"
                                value={editForm.surname}
                                onChange={handleEditChange}
                                placeholder="Surname"
                              />
                            </div>
                          </div>
                        ) : (
                          <strong className="user-fullname">{user.name} {user.surname}</strong>
                        )}
                      </td>
                      <td className="user-email">
                        {editingUser === user.id ? (
                          <input
                            type="email"
                            className="email-field form-control form-control-sm"
                            name="email"
                            value={editForm.email}
                            onChange={handleEditChange}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="user-username">
                        {editingUser === user.id ? (
                          <input
                            type="text"
                            className="username-field form-control form-control-sm"
                            name="username"
                            value={editForm.username}
                            onChange={handleEditChange}
                          />
                        ) : (
                          <code className="username-code">@{user.username}</code>
                        )}
                      </td>
                      <td className="user-student-number">
                        {editingUser === user.id ? (
                          <input
                            type="text"
                            className="student-number-field form-control form-control-sm"
                            name="studentNumber"
                            value={editForm.studentNumber}
                            onChange={handleEditChange}
                          />
                        ) : (
                          user.studentNumber || "-"
                        )}
                      </td>
                      <td className="user-phone">
                        {editingUser === user.id ? (
                          <input
                            type="text"
                            className="phone-field form-control form-control-sm"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleEditChange}
                          />
                        ) : (
                          user.phone || "-"
                        )}
                      </td>
                      <td className="user-status">
                        {editingUser === user.id ? (
                          <div className="status-edit form-check form-switch">
                            <input
                              className="status-toggle form-check-input"
                              type="checkbox"
                              name="active"
                              checked={editForm.active}
                              onChange={handleEditChange}
                            />
                          </div>
                        ) : (
                          <span className={`status-badge badge ${user.active !== false ? 'bg-success' : 'bg-danger'}`}>
                            {user.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="user-actions">
                        {editingUser === user.id ? (
                          <div className="edit-actions btn-group btn-group-sm">
                            <button
                              className="save-button btn btn-success"
                              onClick={() => handleUpdateUser(user.id)}
                            >
                              <i className="bi bi-check"></i>
                            </button>
                            <button
                              className="cancel-button btn btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons btn-group btn-group-sm">
                            <button
                              className="edit-button btn btn-outline-primary"
                              onClick={() => handleEditClick(user)}
                              title="Edit User"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className={`status-button btn ${user.active !== false ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              onClick={() => handleToggleStatus(user.id, user.active !== false)}
                              title={user.active !== false ? 'Deactivate' : 'Activate'}
                            >
                              <i className={`bi ${user.active !== false ? 'bi-pause' : 'bi-play'}`}></i>
                            </button>
                            <button
                              className="delete-button btn btn-outline-danger"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete User"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="management-stats row mt-4">
        <div className="stat-card col-md-3">
          <div className="card total-users-card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-3">
          <div className="card active-users-card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Active Users</h5>
              <p className="card-text display-6">
                {users.filter(user => user.active !== false).length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-3">
          <div className="card inactive-users-card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Inactive Users</h5>
              <p className="card-text display-6">
                {users.filter(user => user.active === false).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;