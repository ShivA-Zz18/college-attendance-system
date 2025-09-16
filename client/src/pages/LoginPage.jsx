import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 1. Import the context
import './FormStyles.css';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext); // 2. Get the login function from the context
  const navigate = useNavigate(); // 3. Get the navigation function

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 4. Make the submit function asynchronous to handle the API call
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Call the login function from our context
      navigate('/'); // On success, redirect to the homepage
    } catch (err) {
      console.error('Login failed', err);
      // You can add a state here to show an error message to the user
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Sign In</h1>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
        <p className="form-footer-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;