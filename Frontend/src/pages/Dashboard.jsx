import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/auth/all-users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllUsers(res.data);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };

    fetchAllUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `http://localhost:5001/api/auth/delete-user/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAllUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("User deleted successfully!");
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <><Toaster position="top-center" />
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all registered users</p>
      </div>

      {/* Grid Wrapper */}
      <div className="dashboard-grid">
        {allUsers.length === 0 ? (
          <p>No Users Found</p>
        ) : (
          allUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className="card-content">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDelete(user._id)}
              >
                Remove User
              </button>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
