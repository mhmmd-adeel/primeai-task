import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Import the configured Axios instance


const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  
  // Watch password field for confirm password validation
  const password = watch("password", "");
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // 💡 Wires up to your backend's registration endpoint
      const response = await api.post('/auth/signup', { 
        name: data.username,
        email: data.email,
        password: data.password 
      });
      
      autoSignInAfterRegistration(response.data.token, response.data.user);
      
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      // Display specific error message from the backend (e.g., "User already exists")
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create a New Account
        </h2>
        
        {/* Messages */}
        {errorMsg && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{errorMsg}</div>}
        {successMsg && <div className="p-3 text-sm text-green-700 bg-green-100 rounded">{successMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              placeholder="Enter your name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                }
              })}
              type="email"
              placeholder="user@example.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register("password", { 
                required: "Password is required",
                minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters"
                }
              })}
              type="password"
              placeholder="********"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              {...register("confirmPassword", { 
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords must match"
              })}
              type="password"
              placeholder="********"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;