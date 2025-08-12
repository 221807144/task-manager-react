import React, { useState } from "react";

const NewTask = ({ onTaskCreated, onCancel, users }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assignedUserId: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!taskData.title) newErrors.title = "Task title is required";
    if (!taskData.assignedUserId) newErrors.assignedUserId = "Assignee is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Format due date
    const dueDateISO = taskData.dueDate ? taskData.dueDate + "T00:00:00" : null;

    const payload = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority.toUpperCase(),
      dueDate: dueDateISO,
      assignedUser: { id: Number(taskData.assignedUserId) }
    };

    try {
      const response = await fetch(
        "http://localhost:8080/TaskManagement/TaskManagement/task/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        const createdTask = await response.json();
        alert("✅ Task created successfully!");
        if (onTaskCreated) onTaskCreated(createdTask);
      } else {
        const errorText = await response.text();
        alert("❌ Failed to create task: " + errorText);
      }
    } catch (error) {
      alert("❌ Could not connect to server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg w-100" style={{ maxWidth: "700px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">New Task</h2>
          <form onSubmit={handleSubmit}>
            {/* Task Title */}
            <div className="mb-3">
              <label className="form-label">Task Title*</label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="form-control"
              />
              {errors.title && <small className="text-danger">{errors.title}</small>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
              ></textarea>
            </div>

            {/* Priority, Due Date, Assignee */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={taskData.dueDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Assignee*</label>
                <select
                  name="assignedUserId"
                  value={taskData.assignedUserId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select assignee</option>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstname} {user.surname}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Masibuve</option>
                      <option value="2">Phihlello</option>
                      <option value="3">Team</option>
                    </>
                  )}
                </select>
                {errors.assignedUserId && (
                  <small className="text-danger">{errors.assignedUserId}</small>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline-secondary me-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
