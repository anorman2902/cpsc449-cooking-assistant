import React from 'react';
import './Profile.css';
import { useAuth } from '../../contexts/AuthContext';

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>
        
        {user && (
          <div className="profile-info">
            <div className="profile-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            
            <div className="profile-details">
              <h2 className="profile-name">{user.username}</h2>
              <p className="profile-email">{user.email}</p>
            </div>
            
            <div className="profile-actions">
              <button className="edit-profile-btn">Edit Profile</button>
              <button className="logout-btn" onClick={logout}>Log Out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;