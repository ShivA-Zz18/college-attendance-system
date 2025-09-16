import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 1. Import the context
import './FormStyles.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const { register } = useContext(AuthContext); // 2. Get the register function
  const navigate = useNavigate(); // 3. Get the navigation function

  const { name, email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 4. Make the submit function asynchronous
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role); // Call the register function
      alert('Registration successful! Please log in.');
      navigate('/login'); // On success, redirect the user to the login page
    } catch (err) {
      console.error('Registration failed', err);
      // You can get more specific error messages from err.response.data.msg
      alert('Registration failed. The email might already be in use.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Create Account</h1>
        <form onSubmit={onSubmit}>
          <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required />
          <select name="role" value={role} onChange={onChange}>
            <option value="student">I am a Student</option>
            <option value="teacher">I am a Teacher</option>
          </select>
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
        <p className="form-footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;