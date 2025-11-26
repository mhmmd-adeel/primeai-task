import React from 'react';
import api from '../services/api';

/**
 * Renders a list of tasks with options to edit and delete.
 */
// 🚨 FIX 1: Ensure props are destructured correctly, including the onEditTask handler.
const TaskList = ({ tasks = [], onEditTask, onTaskDelete }) => {
  const [deletingId, setDeletingId] = React.useState(null);

  // Function to determine badge style based on status
  const getStatusBadge = (status) => {
    let color = 'bg-gray-200 text-gray-800';
    if (status === 'In Progress') {
      color = 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Completed') {
      color = 'bg-green-100 text-green-800';
    } else if (status === 'Pending') {
      color = 'bg-blue-100 text-blue-800';
    }
    return <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${color}`}>{status}</span>;
  };

  // Function to format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handles the Delete operation
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    setDeletingId(taskId);
    try {
      await api.delete(`/tasks/${taskId}`);
      onTaskDelete(); // Notify parent component (Dashboard) to refresh the list
    } catch (error) {
      console.error('Error deleting task:', error.response?.data?.message || error.message);
      alert('Failed to delete task. Check console for details.');
    } finally {
      setDeletingId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center p-6 bg-white border border-dashed border-gray-300 rounded-lg">
        <p className="text-lg text-gray-500">No tasks found. Get started by adding a new task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900 truncate mr-3">{task.title}</h3>
                {/* Display the status badge */}
                {getStatusBadge(task.status)}
              </div>
              <p className="mt-1 text-sm text-gray-600 break-words">{task.description}</p>
              <p className="mt-2 text-xs text-indigo-600">Created: {formatDate(task.createdAt)}</p>
            </div>
            
            <div className="flex-shrink-0 ml-4 flex space-x-2">
              
              {/* Edit Button */}
              <button
                // 🚨 FIX 2: Call the correct prop function (onEditTask)
                onClick={() => onEditTask(task)} 
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium p-1 rounded-md hover:bg-gray-100 transition-colors"
                title="Edit Task"
              >
                Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(task._id)}
                disabled={deletingId === task._id}
                className="text-red-600 hover:text-red-900 text-sm font-medium p-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Task"
              >
                {deletingId === task._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;