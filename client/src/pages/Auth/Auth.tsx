import React, { useState } from 'react';
import './Auth.css';

function Auth() {
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

    // Error state
    const [error, setError] = useState('');

    // Toggle between login and signup forms
    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
        setError(''); // Clear any errors when switching forms
    };

    // Handle login form submission
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!loginEmail || !loginPassword) {
        setError('Please fill in all fields');
        return;
        }
        
        // Clear error
        setError('');
        
        // TODO: Implement actual login logic
        console.log('Login attempted with:', { email: loginEmail, password: loginPassword });
    };

    // Handle signup form submission
    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!username || !signupEmail || !signupPassword || !confirmPassword) {
        setError('Please fill in all fields');
        return;
        }
        
        if (signupPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
        }
        
        if (signupPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
        }
        
        // Clear error
        setError('');
        
        // TODO: Implement actual signup logic
        console.log('Signup attempted with:', { username, email: signupEmail, password: signupPassword });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                <div className="auth-toggle">
                    <button 
                    className={`toggle-btn ${isLoginForm ? 'active' : ''}`} 
                    onClick={() => isLoginForm ? null : toggleForm()}
                    >
                    Log In
                    </button>
                    <button 
                    className={`toggle-btn ${!isLoginForm ? 'active' : ''}`}
                    onClick={() => isLoginForm ? toggleForm() : null}
                    >
                    Sign Up
                    </button>
                </div>
                </div>
                
                {error && <div className="auth-error">{error}</div>}
                
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
                    />
                    </div>
                    
                    <div className="form-options">
                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <a href="/forgot-password" className="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" className="auth-button">Log In</button>
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
                    />
                    </div>
                    
                    <div className="terms-agreement">
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">
                        I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                    </label>
                    </div>
                    
                    <button type="submit" className="auth-button">Create Account</button>
                </form>
                )}
            </div>
        </div>
    );
}

export default Auth;