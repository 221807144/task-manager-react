import React, { useState } from "react";

const Login = ({ onRegisterClick, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState("user");
  const [googleEmail, setGoogleEmail] = useState("");
  const [error, setError] = useState("");
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    const username = email.split('@')[0];
    onLoginSuccess({ email, username, profileType });
  };

  const handleGoogleLogin = () => {
    if (!googleEmail.includes("@")) {
      setError("Please enter a valid Google email");
      return;
    }
    setError("");
    setShowGoogleLogin(false);
    const username = googleEmail.split('@')[0];
    onLoginSuccess({ email: googleEmail, username, profileType });
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column justify-content-center align-items-center py-4">
      <h1 className="text-primary fw-bold mb-2">Task Management System</h1>
      <p className="text-primary mb-4">Welcome back! Please log in</p>

      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "420px", background: 'rgba(255,255,255,0.95)' }}>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Login As</label>
            <select
              className="form-select"
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${error && !email.includes("@") ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${error && password.length < 6 ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Log In as {profileType === "user" ? "User" : "Admin"}
          </button>
        </form>

        <div className="d-flex align-items-center mb-3">
          <hr className="flex-grow-1" />
          <span className="mx-2 text-muted">or</span>
          <hr className="flex-grow-1" />
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          onClick={() => setShowGoogleLogin(true)}
        >
          Continue with Google
        </button>

        <div className="text-center mt-4 text-muted">
          Don't have an account?{" "}
          <button
            className="btn btn-link p-0 text-decoration-none text-primary"
            onClick={onRegisterClick}
          >
            Register here
          </button>
        </div>
      </div>

      {showGoogleLogin && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="card p-4" style={{ width: "350px" }}>
            <h5 className="mb-3">Sign in with Google</h5>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your Google email"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleGoogleLogin}>
              Continue
            </button>
            <button
              className="btn btn-link mt-2 text-danger"
              onClick={() => setShowGoogleLogin(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;