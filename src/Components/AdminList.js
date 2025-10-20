import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/TaskManagement/api/admins/all")
      .then((res) => setAdmins(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleStatus = async (id) => {
    await axios.patch(`http://localhost:8080/TaskManagement/api/admins/${id}/toggle-status`);
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      )
    );
  };

  const deleteAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      await axios.delete(`http://localhost:8080/TaskManagement/api/admins/delete/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <h2>All Admins</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.username}</td>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td>{a.active ? "Active" : "Inactive"}</td>
              <td>{a.createdAt}</td>
              <td>
                <button onClick={() => toggleStatus(a.id)}>Toggle</button>
                <button onClick={() => deleteAdmin(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;
