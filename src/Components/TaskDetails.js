import React, { useState } from "react";

const TaskDetails = ({ task, onBack, onSave }) => {
  const [comment, setComment] = useState("");
  const [attachments, setAttachments] = useState(task?.attachments || []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const updatedTask = {
        ...task,
        comments: [...task.comments, comment],
      };
      onSave(updatedTask);
      setComment("");
    }
  };

  const handleAttachmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedAttachments = [
        ...attachments,
        { name: file.name, checked: false },
      ];
      setAttachments(updatedAttachments);
      onSave({
        ...task,
        attachments: updatedAttachments,
      });
    }
  };

  if (!task) {
    return (
      <div className="container py-5">
        <p>No task selected</p>
        <button onClick={onBack} className="btn btn-primary mt-3">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">{task.title}</h1>
          <button onClick={onBack} className="btn btn-outline-secondary">
            Back to List
          </button>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Description</h5>
            <p className="card-text">{task.description}</p>

            <div className="row">
              <div className="col-md-3 mb-3">
                <small className="text-muted">Status</small>
                <p>{task.status}</p>
              </div>
              <div className="col-md-3 mb-3">
                <small className="text-muted">Priority</small>
                <p className={
                  task.priority === "High" ? "text-danger" :
                  task.priority === "Medium" ? "text-warning" : "text-success"
                }>
                  {task.priority}
                </p>
              </div>
              <div className="col-md-3 mb-3">
                <small className="text-muted">Due Date</small>
                <p>{task.dueDate}</p>
              </div>
              <div className="col-md-3 mb-3">
                <small className="text-muted">Assignee</small>
                <p>{task.assignee}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Comments</h5>
            {task.comments?.length > 0 ? (
              <ul className="list-group list-group-flush mb-3">
                {task.comments.map((c, i) => (
                  <li key={i} className="list-group-item border-start border-4 border-secondary">
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No comments yet</p>
            )}

            <form onSubmit={handleCommentSubmit}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Add a comment..."
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Post Comment
              </button>
            </form>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Attachments</h5>
            {attachments.length > 0 ? (
              <ul className="list-group mb-3">
                {attachments.map((file, index) => (
                  <li key={index} className="list-group-item d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={file.checked || false}
                      onChange={() => {
                        const updated = [...attachments];
                        updated[index].checked = !updated[index].checked;
                        setAttachments(updated);
                      }}
                    />
                    {file.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No attachments yet</p>
            )}

            <label className="btn btn-primary">
              Upload File
              <input type="file" hidden onChange={handleAttachmentUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
