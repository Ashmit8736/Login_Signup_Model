import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password length check
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    // Confirm password match check
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      await axios.post(
        'http://localhost:5001/api/auth/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );

      toast.success("Signup Successful 🎉 Redirecting to Login...");

      // Signup ke baad login page redirect
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.msg || 'Signup failed ❌');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Create Account</h2>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ashmit Singh"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ashmit@example.com"
              />
            </div>

            {/* Password */}
            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="At least 6 characters"
                />
                <span 
                  className="show-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group password-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
                />
                <span 
                  className="show-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            <button type="submit" className="auth-btn">
              Register
            </button>
          </form>

          <p className="switch-auth">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
