// src/pages/DashboardPage.jsx (Structure Outline)
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';
import TaskEditModal from '../components/TaskEditModal'

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleEditOpen = (task) => setTaskToEdit(task);

  const handleEditClose = () => {
    setTaskToEdit(null); // Close the modal
    fetchTasks();        // Refresh list to see updates
  };

  const fetchTasks = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const response = await api.get('/tasks');
            // 🚨 FIX: Ensure you are setting the state correctly.
            // If the backend returns: res.status(200).json(tasks);
            // Then the response data IS the tasks array.
            setTasks(response.data); 
            
        } catch (error) {
            // ... (error handling)
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = (tasks ?? []).filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) return <div className='h-screen font-semibold text-lg flex justify-center items-center'>Loading Dashboard...</div>;
 
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={logout} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* User Profile */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Welcome, {user.name}!</h1>
        
        </div>

        {/* Task Management */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          
          {/* Column 1: Add New Task (C) */}
          <div className="lg:col-span-1">
            <TaskForm refreshTasks={fetchTasks} />
          </div>

          {/* Column 2 & 3: Task List (R, U, D) & Search/Filter */}
          <div className="lg:col-span-2 mt-6 lg:mt-0">
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Tasks</h2>
              
              {/* Search and Filter UI */}
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />

            <TaskList 
        tasks={filteredTasks} 
        onEditTask={handleEditOpen}
        onTaskDelete={fetchTasks} 

        />
        <TaskEditModal 
        task={taskToEdit} 
        onClose={handleEditClose} 
        refreshTasks={fetchTasks} 
      />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;