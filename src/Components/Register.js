import React, { useState } from "react";

const Register = ({ onLoginClick, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    idNumber: "",
    studentNumber: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.surname) newErrors.surname = "Surname is required";
    if (!formData.idNumber) newErrors.idNumber = "ID/Passport is required";
    if (!formData.studentNumber) newErrors.studentNumber = "Student number is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    if (formData.username.length < 4) newErrors.username = "Username too short";
    if (formData.password.length < 8) newErrors.password = "Password must be 8+ characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(
          "http://localhost:8080/TaskManagement/TaskManagement/user/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: formData.name,
              surname: formData.surname,
              idNumber: formData.idNumber,
              studentNumber: formData.studentNumber,
              phone: formData.phone,
              email: formData.email,
              username: formData.username,
              password: formData.password
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("User registered:", data);
          alert("Registration successful!");
          onRegisterSuccess(); // callback to redirect or show login form
        } else {
          const error = await response.text();
          console.error("Registration failed:", error);
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Could not connect to the server. Please try again later.");
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Name*</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="col">
              <label className="form-label">Surname*</label>
              <input
                type="text"
                className="form-control"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
              {errors.surname && <small className="text-danger">{errors.surname}</small>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">ID/Passport Number*</label>
            <input
              type="text"
              className="form-control"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
            />
            {errors.idNumber && <small className="text-danger">{errors.idNumber}</small>}
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Student Number*</label>
              <input
                type="text"
                className="form-control"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
              />
              {errors.studentNumber && (
                <small className="text-danger">{errors.studentNumber}</small>
              )}
            </div>
            <div className="col">
              <label className="form-label">Phone Number*</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email*</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Username*</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <small className="text-danger">{errors.username}</small>}
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Password*</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
            <div className="col">
              <label className="form-label">Confirm Password*</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword}</small>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <button className="btn btn-link p-0" onClick={onLoginClick}>
              Login Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
