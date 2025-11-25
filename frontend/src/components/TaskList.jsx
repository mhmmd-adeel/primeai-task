import React from 'react';
import api from '../services/api';

/**
 * Renders a list of tasks with options to edit and delete.
 * Assumes a task object has: _id, title, description, and createdAt.
 */
const TaskList = ({ tasks = [], onTaskUpdate, onTaskDelete }) => {
  const [deletingId, setDeletingId] = React.useState(null);

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
      // 💡 Wires up to your backend's DELETE /api/tasks/:id endpoint
      await api.delete(`/tasks/${taskId}`);
      
      // Notify parent component (Dashboard) to refresh the list
      onTaskDelete();
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
              <h3 className="text-lg font-bold text-gray-900 truncate">{task.title}</h3>
              <p className="mt-1 text-sm text-gray-600 break-words">{task.description}</p>
              <p className="mt-2 text-xs text-indigo-600">Created: {formatDate(task.createdAt)}</p>
            </div>
            
            <div className="flex-shrink-0 ml-4 flex space-x-2">
              
              {/* Edit Button */}
              {/* 💡 For the final assignment, this button should open an Edit Modal/Form */}
              <button
                onClick={() => onTaskUpdate(task)} 
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