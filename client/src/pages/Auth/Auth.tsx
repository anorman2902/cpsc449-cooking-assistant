import React, { useState, useEffect } from 'react';
import './Auth.css';
import { useAuth } from '../../contexts/AuthContext';

function Auth() {
    // Get auth context
    const { login, signup, authError, clearAuthError, isAuthenticated, loading } = useAuth();

    // State for tracking active form (login or signup)
    const [isLoginForm, setIsLoginForm] = useState(true);
    
    // State for login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // State for signup form
    const [username, setUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Local error state
    const [formError, setFormError] = useState('');

    // Clear errors when switching forms
    useEffect(() => {
        setFormError('');
        clearAuthError();
    }, [isLoginForm, clearAuthError]);

    // Toggle between login and signup forms
    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    // Handle login form submission
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!loginEmail || !loginPassword) {
            setFormError('Please fill in all fields');
        return;
        }
        
        // Clear error
        setFormError('');
        
        // Attempt login using context
        const success = await login(loginEmail, loginPassword);
        
        if (success) {
        console.log('Login successful!');
        // The context will update isAuthenticated, and user will be redirected
        }
    };

    // Handle signup form submission
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!username || !signupEmail || !signupPassword || !confirmPassword) {
        setFormError('Please fill in all fields');
        return;
        }
        
        if (signupPassword !== confirmPassword) {
        setFormError('Passwords do not match');
        return;
        }
        
        if (signupPassword.length < 8) {
        setFormError('Password must be at least 8 characters long');
        return;
        }
        
        // Clear error
        setFormError('');
        
        // Attempt signup using context
        const success = await signup(username, signupEmail, signupPassword);
        
        if (success) {
        console.log('Signup successful!');
        // The context will update isAuthenticated, and user will be redirected
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-toggle">
                        <button 
                        className={`toggle-btn ${isLoginForm ? 'active' : ''}`} 
                        onClick={() => isLoginForm ? null : toggleForm()} disabled={loading}
                        >
                        Log In
                        </button>
                        <button 
                        className={`toggle-btn ${!isLoginForm ? 'active' : ''}`}
                        onClick={() => isLoginForm ? toggleForm() : null} disabled={loading}
                        >
                        Sign Up
                        </button>
                    </div>
                </div>
                
                {/* Display errors (either from form validation or auth context) */}
                {(formError || authError) && (
                <div className="auth-error">
                    {formError || authError}
                </div>
                )}
                
                {isLoginForm ? (
                    // Login Form
                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label htmlFor="loginEmail">Email</label>
                            <input
                                type="email"
                                id="loginEmail"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                        <label htmlFor="loginPassword">Password</label>
                        <input
                            type="password"
                            id="loginPassword"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                        </div>
                        
                        <div className="form-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" disabled={loading}/>
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="/forgot-password" className="forgot-password" onClick={(e) => loading && e.preventDefault()}>Forgot password?</a>
                        </div>
                        
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                    ) : (
                    // Signup Form
                    <form className="auth-form" onSubmit={handleSignupSubmit}>
                        <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                            disabled={loading}
                        />
                        </div>
                        
                        <div className="form-group">
                        <label htmlFor="signupEmail">Email</label>
                        <input
                            type="email"
                            id="signupEmail"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                        </div>
                        
                        <div className="form-group">
                        <label htmlFor="signupPassword">Password</label>
                        <input
                            type="password"
                            id="signupPassword"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Create a password (min. 8 characters)"
                            required
                            disabled={loading}
                        />
                        </div>
                        
                        <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            disabled={loading}
                        />
                        </div>
                        
                        <div className="terms-agreement">
                        <input type="checkbox" id="terms" required disabled={loading}/>
                        <label htmlFor="terms">
                            I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                        </label>
                        </div>
                        
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Auth;