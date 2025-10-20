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
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4">Dashboard</h1>
          <p className="lead">Welcome back, {user?.name || user?.username}!</p>
          {user?.email && <small className="text-muted">{user.email}</small>}
        </div>
        <div className="col-auto position-relative">
          <button 
            className="btn btn-light border rounded-circle p-0 me-2"
            style={{ width: '45px', height: '45px', fontSize: '18px' }}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <i className="bi bi-person-circle"></i>
          </button>
          <button 
            className="btn btn-outline-danger"
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>

          {showUserDropdown && (
            <div 
              className="position-absolute bg-white border rounded shadow-lg p-3"
              style={{ 
                top: '55px', 
                right: '0', 
                width: '300px', 
                zIndex: 1000 
              }}
            >
              <div className="text-center mb-3">
                <div 
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: '60px', height: '60px', fontSize: '24px' }}
                >
                  {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <h6 className="mb-0">{user?.name || user?.username}</h6>
                <small className="text-muted">@{user?.username}</small>
                <div className="mt-2">
                  <span className={`badge ${user?.profileType === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                    {user?.profileType === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
              <hr />
              <div className="mb-2">
                <small className="text-muted">Email</small>
                <p className="mb-0 small">{user?.email}</p>
              </div>
              {user?.phone && (
                <div className="mb-2">
                  <small className="text-muted">Phone</small>
                  <p className="mb-0 small">{user?.phone}</p>
                </div>
              )}
              {user?.studentNumber && (
                <div className="mb-2">
                  <small className="text-muted">Student Number</small>
                  <p className="mb-0 small">{user?.studentNumber}</p>
                </div>
              )}
              <hr />
              <button 
                className="btn btn-primary btn-sm w-100"
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

      <div className="row mb-4">
        <div className="col">
          <div className="btn-group" role="group">
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('newtask')}
            >
              <i className="bi bi-plus-circle me-2"></i>Add New Task
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('tasklist')}
            >
              <i className="bi bi-list-task me-2"></i>View Task List
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="card-text display-6">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="card-text display-6">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">In Progress</h5>
              <p className="card-text display-6">{stats.inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-danger h-100">
            <div className="card-body">
              <h5 className="card-title">Overdue</h5>
              <p className="card-text display-6">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Recent Tasks</h5>
        </div>
        <div className="card-body">
          {tasks.length === 0 ? (
            <div className="alert alert-info mb-0">No tasks available</div>
          ) : (
            <div className="list-group">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{task.title}</h6>
                    <small className={`badge ${
                      task.status === 'Done' ? 'bg-success' : 
                      task.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {task.status}
                    </small>
                  </div>
                  <p className="mb-1">{task.description}</p>
                  <small>Due: {task.dueDate || 'No due date'}</small>
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