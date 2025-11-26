import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api'; // Your configured Axios instance

const TaskForm = ({ refreshTasks }) => {
  // Initialize react-hook-form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'Pending', // Default status
    }
  });

  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      // 💡 Wires up to your protected POST /api/tasks endpoint
      await api.post('/tasks', data); 

      setSuccessMsg('Task created successfully!');
      reset(); // Clear the form fields

      // 🚨 CRITICAL STEP: Call the parent function to refresh the list
      refreshTasks();
      
    } catch (err) {
      console.error('Task creation error:', err.response?.data);
      // Display specific error message from the backend if available
      setErrorMsg(err.response?.data?.message || 'Failed to create task. Please ensure all fields are valid.');
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Task</h3>
      
      {/* Messages */}
      {errorMsg && <div className="p-3 my-2 text-sm text-red-700 bg-red-100 rounded">{errorMsg}</div>}
      {successMsg && <div className="p-3 my-2 text-sm text-green-700 bg-green-100 rounded">{successMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Title Field (Required by backend controller) */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="E.g., Complete frontend assignment"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            id="description"
            {...register("description")}
            rows="3"
            placeholder="Detailed description of the task..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isSubmitting ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;