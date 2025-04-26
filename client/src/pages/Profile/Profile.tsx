import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useAuth } from '../../contexts/AuthContext';
import { profileApi } from '../../services/userService';

function Profile() {
  const { user, logout, token, updateUserContext } = useAuth();

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for the username input field value
  const [usernameInput, setUsernameInput] = useState('');
  // State for loading indicator during save
  const [loading, setLoading] = useState(false);
  // State for displaying errors during edit
  const [error, setError] = useState<string | null>(null);

  // Pre-fill the input when editing starts or user data changes
  useEffect(() => {
    if (user) {
      setUsernameInput(user.username);
    }
  }, [user]); // Re-run if user object changes

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling, reset input to current user's username
      if (user) setUsernameInput(user.username);
      setError(null); // Clear errors on cancel
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!token || !user) return; // Should not happen if logged in
    if (usernameInput.trim() === '') {
        setError('Username cannot be empty.');
        return;
    }
    if (usernameInput === user.username) {
        // No change, just exit edit mode
        setIsEditing(false);
        setError(null);
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await profileApi.updateProfile(token, { username: usernameInput });
      // Update the user state in the global context
      updateUserContext(result.user);
      setIsEditing(false); // Exit edit mode on success
      // Optionally show success message: alert(result.message);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render Loading or No User state if necessary
  if (!user) {
      return <div className="profile-page"><p>Loading profile or not logged in...</p></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-info">
          <div className="profile-avatar">
            {/* Display first letter based on potentially updated usernameInput if editing, otherwise user.username */}
            {(isEditing ? usernameInput : user.username)?.charAt(0).toUpperCase() || '?'}
          </div>

          <div className="profile-details">
            {isEditing ? (
              // Edit Mode 
              <div className="form-group" style={{ marginBottom: '1rem', width: '80%', maxWidth: '300px' }}>
                <label htmlFor="usernameEdit" style={{ marginBottom: '0.3rem' }}>Username:</label>
                <input
                  type="text"
                  id="usernameEdit"
                  className="profile-name-input" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={loading}
                  style={{ padding: '0.5rem', fontSize: '1.1rem' }} // Basic input styling
                />
              </div>
            ) : (
              // Display Mode 
              <>
                <h2 className="profile-name">{user.username}</h2>
                <p className="profile-email">{user.email}</p>
              </>
            )}
          </div>

          {/* Display error message if exists */}
          {error && <p className="auth-error" style={{ width: '80%', maxWidth: '300px' }}>{error}</p>}

          <div className="profile-actions">
            {isEditing ? (
              // Edit Mode Actions
              <>
                <button onClick={handleSave} className="edit-profile-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={handleEditToggle} className="logout-btn" disabled={loading}>
                  Cancel
                </button>
              </>
            ) : (
              // Display Mode Actions
              <>
                <button onClick={handleEditToggle} className="edit-profile-btn">
                   Edit Profile
                </button>
                <button className="logout-btn" onClick={logout}>
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;