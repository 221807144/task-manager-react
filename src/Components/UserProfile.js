import React, { useState } from 'react';

const UserProfile = ({ user, onNavigate, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: user?.phone || '',
    studentNumber: user?.studentNumber || '',
    idNumber: user?.idNumber || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      surname: user?.surname || '',
      email: user?.email || '',
      username: user?.username || '',
      phone: user?.phone || '',
      studentNumber: user?.studentNumber || '',
      idNumber: user?.idNumber || ''
    });
    setIsEditing(false);
  };

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
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div 
                className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '120px', height: '120px', fontSize: '48px' }}
              >
                {formData.name?.charAt(0) || 'U'}{formData.surname?.charAt(0) || ''}
              </div>
              <h4>{formData.name} {formData.surname}</h4>
              <p className="text-muted mb-2">@{formData.username}</p>
              <div className="mb-3">
                <span className="role-badge badge bg-primary">
                  {user?.profileType === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>

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
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Surname*</label>
                      <input
                        type="text"
                        className="form-control"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Email*</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
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
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0123456789"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Student Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="studentNumber"
                        value={formData.studentNumber}
                        onChange={handleChange}
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
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="submit"
                      className="btn btn-primary"
                    >
                      <i className="bi bi-check-circle me-2"></i>Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;