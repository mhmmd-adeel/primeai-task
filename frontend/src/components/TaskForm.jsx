// frontend/src/components/TaskForm.jsx
import React from 'react';

const TaskForm = ({ refreshTasks }) => {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Create New Task</h3>
      <p>Form submission logic goes here. Success should call refreshTasks().</p>
    </div>
  );
};

export default TaskForm;