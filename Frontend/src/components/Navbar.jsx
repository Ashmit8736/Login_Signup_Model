import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.name) return "";
    const nameParts = user.name.trim().split(" ");
    const first = nameParts[0]?.charAt(0).toUpperCase();
    const last = nameParts[1]?.charAt(0).toUpperCase() || "";
    return first + last;
  };

  return (
    <nav className="navbar">
      <div className="nav-top">
        <div className="nav-logo">
          <Link to="/">MyBrand</Link>
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
        <li><Link to="/tasks">Task Dashboard</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>

        {isAuthenticated ? (
          <li className="profile-wrapper" ref={dropdownRef}>
            <div
              className="profile-avatar"
              onClick={() => setOpen(!open)}
            >
              {getInitials()}
            </div>

            {open && (
              <div className="dropdown-menu">
                <p className="user-name">{user?.name}</p>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
