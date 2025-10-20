import React, { useState } from 'react';

const Dashboard = ({ tasks, user, onNavigate, onLogout }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'Done').length,
    inProgressTasks: tasks.filter(task => task.status === 'In Progress').length,
    overdueTasks: tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'Done'
    ).length
  };

  return (
    <div className="dashboard-container container py-5">
      <div className="dashboard-header row mb-4">
        <div className="header-content col">
          <h1 className="dashboard-title display-4">Dashboard</h1>
          <p className="welcome-message lead">Welcome back, {user?.name || user?.username}!</p>
          {user?.email && <small className="user-email text-muted">{user.email}</small>}
        </div>
        <div className="header-actions col-auto position-relative">
          <button 
            className="user-avatar-btn btn btn-light border rounded-circle p-0 me-2"
            style={{ width: '45px', height: '45px', fontSize: '18px' }}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <i className="bi bi-person-circle"></i>
          </button>
          <button 
            className="logout-button btn btn-outline-danger"
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>

          {showUserDropdown && (
            <div 
              className="user-dropdown position-absolute bg-white border rounded shadow-lg p-3"
              style={{ 
                top: '55px', 
                right: '0', 
                width: '300px', 
                zIndex: 1000 
              }}
            >
              <div className="dropdown-header text-center mb-3">
                <div 
                  className="user-avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: '60px', height: '60px', fontSize: '24px' }}
                >
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <h6 className="user-display-name mb-0">{user?.name || user?.username}</h6>
                <small className="user-username text-muted">@{user?.username}</small>
                <div className="user-role mt-2">
                  <span className={`role-badge badge ${user?.profileType === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                    {user?.profileType === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
              <hr className="dropdown-divider" />
              <div className="user-info mb-2">
                <small className="info-label text-muted">Email</small>
                <p className="info-value mb-0 small">{user?.email}</p>
              </div>
              {user?.phone && (
                <div className="user-info mb-2">
                  <small className="info-label text-muted">Phone</small>
                  <p className="info-value mb-0 small">{user?.phone}</p>
                </div>
              )}
              {user?.studentNumber && (
                <div className="user-info mb-2">
                  <small className="info-label text-muted">Student Number</small>
                  <p className="info-value mb-0 small">{user?.studentNumber}</p>
                </div>
              )}
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

      <div className="action-buttons row mb-4">
        <div className="col">
          <div className="btn-group button-group" role="group">
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
          </div>
        </div>
      </div>

      <div className="stats-cards row mb-4">
        <div className="stat-card col-md-3 mb-3">
          <div className="card total-tasks-card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="card-text display-6">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-3 mb-3">
          <div className="card completed-tasks-card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="card-text display-6">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-3 mb-3">
          <div className="card progress-tasks-card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">In Progress</h5>
              <p className="card-text display-6">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="stat-card col-md-3 mb-3">
          <div className="card overdue-tasks-card text-white bg-danger h-100">
            <div className="card-body">
              <h5 className="card-title">Overdue</h5>
              <p className="card-text display-6">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-tasks-card card">
        <div className="card-header">
          <h5 className="card-title mb-0">Recent Tasks</h5>
        </div>
        <div className="card-body">
          {tasks.length === 0 ? (
            <div className="no-tasks-alert alert alert-info mb-0">No tasks available</div>
          ) : (
            <div className="tasks-list list-group">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="task-item list-group-item list-group-item-action">
                  <div className="task-header d-flex w-100 justify-content-between">
                    <h6 className="task-title mb-1">{task.title}</h6>
                    <small className={`task-status badge ${
                      task.status === 'Done' ? 'bg-success' : 
                      task.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {task.status}
                    </small>
                  </div>
                  <p className="task-description mb-1">{task.description}</p>
                  <small className="task-due-date">Due: {task.dueDate || 'No due date'}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;