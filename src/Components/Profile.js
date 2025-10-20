import React, { useState, useEffect } from 'react';

const UserProfile = ({ user, onNavigate, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: user?.phone || '',
    studentNumber: user?.studentNumber || '',
    idNumber: user?.idNumber || ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch profile data from backend on component mount
  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/profiles/user/${user.id}`);
      
      if (response.ok) {
        const profileData = await response.json();
        setFormData({
          name: profileData.name || '',
          surname: profileData.surname || '',
          email: profileData.email || '',
          username: profileData.username || '',
          phone: profileData.phone || '',
          studentNumber: profileData.studentNumber || '',
          idNumber: profileData.idNumber || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use existing user data if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.surname) newErrors.surname = 'Surname is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Valid phone number required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/profiles/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: user.profileId, // Make sure this is passed from login
            userId: user.id,
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            username: formData.username,
            phone: formData.phone,
            studentNumber: formData.studentNumber,
            idNumber: formData.idNumber
          })
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          onUpdateProfile(updatedProfile);
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          alert('Failed to update profile. Please try again.');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Could not connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      // Add your password change API endpoint here
      const response = await fetch('http://localhost:8080/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        alert('Password updated successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert('Failed to update password. Please check your current password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Could not connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <button 
            className="btn btn-outline-secondary mb-3"
            onClick={() => onNavigate('dashboard')}
          >
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </button>
          <h1 className="display-4">User Profile</h1>
          <p className="lead">Manage your account information</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4">
          {/* Profile Card */}
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div 
                className={`${user?.profileType === 'admin' ? 'bg-danger' : 'bg-primary'} text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3`}
                style={{ width: '120px', height: '120px', fontSize: '48px' }}
              >
                {formData.name?.charAt(0) || 'U'}{formData.surname?.charAt(0) || ''}
              </div>
              <h4>{formData.name} {formData.surname}</h4>
              <p className="text-muted mb-2">@{formData.username}</p>
              <div className="mb-3">
                <span className={`badge ${user?.profileType === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                  {user?.profileType === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowPasswordModal(true)}
              >
                <i className="bi bi-key me-2"></i>Change Password
              </button>
            </div>
          </div>

          {/* Account Info Card */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="card-title mb-3">Account Information</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Account Type:</span>
                <span className={`badge ${user?.profileType === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                  {user?.profileType === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Status:</span>
                <span className="badge bg-success">Active</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Member Since:</span>
                <span>Oct 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Personal Information</h5>
              {!isEditing && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-2"></i>Edit Profile
                </button>
              )}
            </div>
            <div className="card-body">
              {!isEditing ? (
                // View Mode
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Name</label>
                      <p className="mb-0 fw-semibold">{formData.name}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">Surname</label>
                      <p className="mb-0 fw-semibold">{formData.surname}</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Email</label>
                      <p className="mb-0 fw-semibold">{formData.email}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">Username</label>
                      <p className="mb-0 fw-semibold">{formData.username}</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Phone Number</label>
                      <p className="mb-0 fw-semibold">{formData.phone || 'Not provided'}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">Student Number</label>
                      <p className="mb-0 fw-semibold">{formData.studentNumber || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">ID/Passport Number</label>
                      <p className="mb-0 fw-semibold">{formData.idNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Surname*</label>
                      <input
                        type="text"
                        className={`form-control ${errors.surname ? 'is-invalid' : ''}`}
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.surname && <div className="invalid-feedback">{errors.surname}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Email*</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Username*</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        disabled
                      />
                      <small className="text-muted">Username cannot be changed</small>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0123456789"
                        disabled={loading}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Student Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="studentNumber"
                        value={formData.studentNumber}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">ID/Passport Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>Save Changes
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          surname: user?.surname || '',
                          email: user?.email || '',
                          username: user?.username || '',
                          phone: user?.phone || '',
                          studentNumber: user?.studentNumber || '',
                          idNumber: user?.idNumber || ''
                        });
                        setErrors({});
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => !loading && setShowPasswordModal(false)}
        >
          <div className="card" style={{ width: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h5 className="mb-0">Change Password</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <small className="text-muted">Must be at least 8 characters</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary" 
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Update Password
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;