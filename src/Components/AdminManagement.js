import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminManagement = ({ onBack }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const API_BASE = "http://localhost:8080/TaskManagement/api/admins";

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/all`);
      setAdmins(response.data);
    } catch (err) {
      setError("Failed to load admins");
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchAdmins();
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/search?keyword=${search}`);
      setAdmins(response.data);
    } catch (err) {
      setError("Search failed");
      console.error("Error searching admins:", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE}/${id}/toggle-status`);
      setAdmins(admins.map(a => a.id === id ? response.data : a));
    } catch (err) {
      setError("Failed to toggle status");
      console.error("Error toggling admin status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) {
      setError("Failed to delete admin");
      console.error("Error deleting admin:", err);
    }
  };

  if (loading) {
    return (
      <div className="admin-management-loading container py-4 text-center">
        <div className="loading-spinner spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="loading-text mt-2">Loading admins...</p>
      </div>
    );
  }

  return (
    <div className="admin-management-container container py-4">
      <div className="management-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="management-title mb-1">Admin Management</h2>
          <p className="management-subtitle text-muted">Manage system administrators</p>
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
          <div className="input-group">
            <input
              type="text"
              className="search-field form-control"
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button btn btn-primary" onClick={handleSearch}>
              <i className="bi bi-search me-2"></i>Search
            </button>
          </div>
        </div>
      </div>

      <div className="admins-table-card card">
        <div className="card-header">
          <h5 className="table-title card-title mb-0">Administrators ({admins.length})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="admins-table table table-striped table-bordered align-middle mb-0">
              <thead className="table-header table-dark">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.id} className="admin-row">
                    <td className="admin-id">{admin.id}</td>
                    <td className="admin-username">{admin.username}</td>
                    <td className="admin-email">{admin.email}</td>
                    <td className="admin-firstname">{admin.firstName}</td>
                    <td className="admin-lastname">{admin.lastName}</td>
                    <td className="admin-role">{admin.role}</td>
                    <td className="admin-status">
                      <span className={`status-badge badge ${admin.active ? 'bg-success' : 'bg-danger'}`}>
                        {admin.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="admin-created">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="admin-actions">
                      <div className="action-buttons btn-group btn-group-sm">
                        <button
                          className="status-toggle-button btn btn-warning me-2"
                          onClick={() => toggleStatus(admin.id)}
                          title="Toggle Status"
                        >
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                        <button
                          className="delete-button btn btn-danger"
                          onClick={() => handleDelete(admin.id)}
                          title="Delete Admin"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {admins.length === 0 && !loading && (
        <div className="no-admins-card card text-center mt-4">
          <div className="card-body">
            <div className="no-admins-content text-muted">
              <i className="bi bi-shield-check display-4 d-block mb-2"></i>
              No administrators found
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;