import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api'; 

const TaskEditModal = ({ task, onClose, refreshTasks }) => {
  // Use 'task' data to set form defaults
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  
  // CRITICAL: This hook runs when the 'task' prop changes, populating the form for editing.
  useEffect(() => {
    if (task) {
        // Sets values for the form fields based on the task object
        reset({
            title: task.title,
            description: task.description,
            status: task.status, // Loads current status, fixing the differentiation issue
        });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      // 💡 Wires up to your protected PUT /api/tasks/:id endpoint
      // We use task._id (Mongoose default ID) to identify which task to update
      await api.put(`/tasks/${task._id}`, data); 
      
      refreshTasks(); // Trigger the fetchTasks in the Dashboard to update the list
      onClose();      // Close modal on success
      
    } catch (err) {
      console.error('Task update error:', err.response?.data);
      setErrorMsg(err.response?.data?.message || 'Failed to update task. Check console for details.');
    }
  };

  // Do not render the modal unless a task object is present (task != null)
  if (!task) return null; 

  return (
    // Fixed positioning and overlay styling for a standard modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
        <h3 className="text-2xl font-bold mb-4">Edit Task: {task.title}</h3>
        
        {errorMsg && <div className="p-3 my-2 text-sm text-red-700 bg-red-100 rounded">{errorMsg}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Title Field */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="edit-title"
              {...register("title", { required: "Title is required" })}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              id="edit-description"
              {...register("description")}
              rows="2"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            ></textarea>
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="edit-status"
              {...register("status")}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {/* Ensure these values match your Mongoose enum exactly: 'Pending', 'In Progress', 'Completed' */}
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Saving...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;