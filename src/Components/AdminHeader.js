// AdminHeader.js
import React, { useState } from 'react';

const AdminHeader = ({ user, onLogout, onNavigate }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="admin-header row mb-4">
      <div className="col">
        <h1 className="admin-title display-4">Admin Dashboard</h1>
        <p className="admin-welcome lead">Welcome back, Admin {user?.name || user?.username}!</p>
        {user?.email && <small className="admin-email text-muted">{user.email}</small>}
      </div>
      <div className="col-auto position-relative">
        <button
          className="admin-avatar-btn btn btn-light border rounded-circle p-0 me-2"
          style={{ width: '45px', height: '45px', fontSize: '18px' }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <i className="bi bi-person-circle"></i>
        </button>
        <button className="admin-logout-button btn btn-outline-danger" onClick={onLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>

        {showDropdown && (
          <div className="admin-dropdown position-absolute bg-white border rounded shadow-lg p-3"
            style={{ top: '55px', right: '0', width: '300px', zIndex: 1000 }}>
            <div className="dropdown-header text-center mb-3">
              <div 
                className="admin-avatar bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                style={{ width: '60px', height: '60px', fontSize: '24px' }}
              >
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'A'}
              </div>
              <h6 className="admin-display-name mb-0">{user?.name || user?.username}</h6>
              <small className="admin-username text-muted">@{user?.username}</small>
              <div className="admin-role mt-2">
                <span className="role-badge badge bg-danger">Administrator</span>
              </div>
            </div>
            <hr className="dropdown-divider" />
            <div className="admin-info mb-2">
              <small className="info-label text-muted">Email</small>
              <p className="info-value mb-0 small">{user?.email}</p>
            </div>
            <hr className="dropdown-divider" />
            <button
              className="edit-profile-button btn btn-primary btn-sm w-100"
              onClick={() => {
                setShowDropdown(false);
                onNavigate('profile');
              }}
            >
              <i className="bi bi-pencil me-2"></i>Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
