import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import toast, { Toaster } from 'react-hot-toast';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5001/api/auth/login', formData);

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    toast.success("Login Successful 🎉");

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);

  } catch (err) {
    toast.error(err.response?.data?.msg || 'Login failed ❌');
  }
};


  return (
    
    <>
    <Toaster position="top-center" />
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" name="email" 
              onChange={handleChange} required 
              placeholder="name@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" name="password" 
              onChange={handleChange} required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p className="switch-auth">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;