import React, { useState } from "react";
import "./TaskList.css";

const TaskList = ({ tasks, onLogout, onNewTask, onViewTask, onUpdateTask }) => {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "All" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return a.title.localeCompare(b.title);
  });

  const getStatusBadge = (status) => {
    let badgeClass = "status-badge ";
    switch(status) {
      case "TODO":
        badgeClass += "bg-warning text-dark";
        break;
      case "IN_PROGRESS":
        badgeClass += "bg-primary";
        break;
      case "DONE":
        badgeClass += "bg-success";
        break;
      default:
        badgeClass += "bg-secondary";
    }
    let label = status.replace("_", " ").toLowerCase()
                      .replace(/\b\w/g, l => l.toUpperCase()); // Friendly label
    return <span className={`${badgeClass} badge`}>{label}</span>;
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setNewStatus(task.status);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setNewStatus("");
  };

  const handleSaveEdit = (task) => {
    onUpdateTask({ ...task, status: newStatus });
    setEditingTaskId(null);
    setNewStatus("");
  };

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Task List</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary d-flex align-items-center" onClick={onNewTask}>
            <span className="me-2 fs-5">+</span> New Task
          </button>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Filter by</label>
            <select 
              className="form-select" 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Sort by</label>
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table task-table">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    {editingTaskId === task.id ? (
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                        className="form-select"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    ) : (
                      getStatusBadge(task.status)
                    )}
                  </td>
                  <td>{task.dueDate || "No due date"}</td>
                  <td>
                    {editingTaskId === task.id ? (
                      <>
                        <button 
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleSaveEdit(task)}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn-sm btn-info me-2"
                          onClick={() => onViewTask(task)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEditClick(task)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedTasks.length === 0 && (
        <div className="card text-center mt-4 p-4">
          <p className="text-muted mb-0">No tasks found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
