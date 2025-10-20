import React, { useState } from "react";

const Register = ({ onLoginClick, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstname: "",
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
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8080/TaskManagement/TaskManagement/user";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.idNumber.trim()) newErrors.idNumber = "ID/Passport is required";
    if (!formData.studentNumber.trim()) newErrors.studentNumber = "Student number is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
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
    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData = {
        firstname: formData.firstname.trim(),
        surname: formData.surname.trim(),
        idNumber: formData.idNumber.trim(),
        studentNumber: formData.studentNumber.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        role: "USER",
        department: "STUDENT"
      };

      console.log("Sending user data:", userData);

      const response = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered successfully:", data);
        alert("🎉 Registration successful! Please login.");
        onRegisterSuccess();
      } else {
        let errorMessage = `Registration failed with status: ${response.status}`;
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(`❌ Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="register-card card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="register-title text-center mb-4">Create Account</h2>
        <p className="text-center text-muted mb-4">Fill in your details to create an account</p>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Name Fields */}
          <div className="name-fields row mb-3">
            <div className="col">
              <label className="form-label">First Name*</label>
              <input
                type="text"
                className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter your first name"
                disabled={loading}
              />
              {errors.firstname && <small className="text-danger">{errors.firstname}</small>}
            </div>
            <div className="col">
              <label className="form-label">Surname*</label>
              <input
                type="text"
                className={`form-control ${errors.surname ? 'is-invalid' : ''}`}
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Enter your surname"
                disabled={loading}
              />
              {errors.surname && <small className="text-danger">{errors.surname}</small>}
            </div>
          </div>

          {/* ID Number */}
          <div className="mb-3">
            <label className="form-label">ID/Passport Number*</label>
            <input
              type="text"
              className={`form-control ${errors.idNumber ? 'is-invalid' : ''}`}
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Enter your ID or passport number"
              disabled={loading}
            />
            {errors.idNumber && <small className="text-danger">{errors.idNumber}</small>}
          </div>

          {/* Contact Fields */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Student Number*</label>
              <input
                type="text"
                className={`form-control ${errors.studentNumber ? 'is-invalid' : ''}`}
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                placeholder="Enter your student number"
                disabled={loading}
              />
              {errors.studentNumber && <small className="text-danger">{errors.studentNumber}</small>}
            </div>
            <div className="col">
              <label className="form-label">Phone Number*</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={loading}
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address*</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username*</label>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username (min 4 characters)"
              disabled={loading}
            />
            {errors.username && <small className="text-danger">{errors.username}</small>}
          </div>

          {/* Password Fields */}
          <div className="row mb-4">
            <div className="col">
              <label className="form-label">Password*</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 8 characters)"
                disabled={loading}
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
            <div className="col">
              <label className="form-label">Confirm Password*</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
              />
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center mt-4">
          <p className="mb-0">
            Already have an account?{" "}
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={onLoginClick}
              disabled={loading}
            >
              Sign In Here
            </button>
          </p>
        </div>

        {/* Debug Info */}
        <div className="mt-3 p-2 bg-light rounded small">
          <strong>Debug Info:</strong> Backend URL: {BASE_URL}
        </div>
      </div>
    </div>
  );
};

export default Register;
