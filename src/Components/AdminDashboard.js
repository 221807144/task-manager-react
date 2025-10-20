import React, { useState } from 'react';

const AdminDashboard = ({ user, onNavigate, onLogout, tasks }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'Done').length,
    inProgressTasks: tasks.filter(task => task.status === 'In Progress').length,
    overdueTasks: tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'Done'
    ).length,
    totalUsers: "",
    activeUsers: ""
  };

  return (
    <div className="admin-dashboard-container container py-5">
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
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <i className="bi bi-person-circle"></i>
          </button>
          <button 
            className="admin-logout-button btn btn-outline-danger"
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>

          {showUserDropdown && (
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
                  setShowUserDropdown(false);
                  onNavigate('profile');
                }}
              >
                <i className="bi bi-pencil me-2"></i>Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="admin-actions row mb-4">
        <div className="col">
          <div className="btn-group admin-button-group" role="group">
            <button 
              className="new-task-button btn btn-primary"
              onClick={() => onNavigate('newtask')}
            >
              <i className="bi bi-plus-circle me-2"></i>Add New Task
            </button>
            <button 
              className="task-list-button btn btn-secondary"
              onClick={() => onNavigate('tasklist')}
            >
              <i className="bi bi-list-task me-2"></i>View Task List
            </button>
            <button 
              className="user-management-button btn btn-info"
              onClick={() => onNavigate('usermanagement')}
            >
              <i className="bi bi-people me-2"></i>Manage Users
            </button>
            <button 
              className="admin-management-button btn btn-warning"
              onClick={() => onNavigate('adminmanagement')}
            >
              <i className="bi bi-shield-check me-2"></i>Manage Admins
            </button>
          </div>
        </div>
      </div>

      <div className="admin-stats row mb-4">
        <div className="stat-card col-md-2 mb-3">
          <div className="card total-tasks-card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="card-text display-6">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-2 mb-3">
          <div className="card completed-tasks-card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="card-text display-6">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-2 mb-3">
          <div className="card progress-tasks-card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">In Progress</h5>
              <p className="card-text display-6">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-2 mb-3">
          <div className="card overdue-tasks-card text-white bg-danger h-100">
            <div className="card-body">
              <h5 className="card-title">Overdue</h5>
              <p className="card-text display-6">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-2 mb-3">
          <div className="card total-users-card text-white bg-info h-100">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-2 mb-3">
          <div className="card active-users-card text-white bg-dark h-100">
            <div className="card-body">
              <h5 className="card-title">Active Users</h5>
              <p className="card-text display-6">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-quick-actions row">
        <div className="col-md-6 mb-4">
          <div className="card quick-actions-card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="quick-actions-list d-grid gap-2">
                <button 
                  className="user-management-action btn btn-outline-primary text-start"
                  onClick={() => onNavigate('usermanagement')}
                >
                  <i className="bi bi-people me-2"></i>User Management
                </button>
                <button 
                  className="admin-management-action btn btn-outline-warning text-start"
                  onClick={() => onNavigate('adminmanagement')}
                >
                  <i className="bi bi-shield-check me-2"></i>Admin Management
                </button>
                <button 
                  className="reports-action btn btn-outline-info text-start"
                  onClick={() => onNavigate('systemreports')}
                >
                  <i className="bi bi-graph-up me-2"></i>System Reports
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card recent-activity-card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="activity-alert alert alert-info mb-0">
                <small>Admin dashboard - Manage users and system settings</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;