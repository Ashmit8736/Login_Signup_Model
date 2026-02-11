import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Tasks.css';
import toast, { Toaster } from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/task', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
      toast.success("Task added successfully!");
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // --- DELETE LOGIC ---
  const deleteTask = async (id) => {
    if (window.confirm("Are You Sure want to delete this task?")) {
      try {
        const token = localStorage.getItem('token');
        
        // Backend route: DELETE /api/tasks/:id
        await axios.delete(`http://localhost:5001/api/task/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
        });

        // UI refresh: Delete ke baad list se wo item hata do
        setTasks(tasks.filter(task => task._id !== id));
        
        toast.success("Task deleted successfully!");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Somethinghs when wrong.");
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/task', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      toast.error("Error adding task");
    }
  };

  return (
    <><Toaster position="top-center" />
    <div className="tasks-container">
      <form className="task-form" onSubmit={onSubmit}>
        <input 
          type="text" name="title" placeholder="Title" 
          value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required 
        />
        <textarea 
          name="description" placeholder="Description" 
          value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required 
        />
        <button type="submit" className="btn-add">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? <p>No tasks found.</p> : tasks.map(task => (
          <div key={task._id} className="task-card">
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            {/* Delete Button */}
            <button 
              onClick={() => deleteTask(task._id)} 
              className="btn-delete"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Tasks;