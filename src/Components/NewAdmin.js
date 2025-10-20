import React, { useState } from "react";
import axios from "axios";

const NewAdmin = () => {
  const [admin, setAdmin] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "SYSTEM_ADMIN",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/admins/create", admin);
      alert("Admin created successfully!");
      setAdmin({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        role: "SYSTEM_ADMIN",
      });
    } catch (err) {
      alert("Error creating admin: " + err.response.data);
    }
  };

  return (
    <div>
      <h2>Create New Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={admin.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={admin.password}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={admin.email}
          onChange={handleChange}
          required
        />
        <input
          name="firstName"
          placeholder="First Name"
          value={admin.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={admin.lastName}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={admin.role}
          onChange={handleChange}
        >
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="CONTENT_MANAGER">Content Manager</option>
          <option value="SUPPORT_ADMIN">Support Admin</option>
          <option value="READ_ONLY">Read Only</option>
        </select>
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default NewAdmin;
