import React, { useState } from 'react';

const AuthForm = () => {
  
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
    });
    setErrors({});
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null, general: null });
    setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation (for both login and register)
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must be 100 characters or less';
    }

    // Password validation (for both login and register)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && // More strict validation only for register
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]).{8,15}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        'Password must be 8-15 characters and include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character';
    }

    // Username validation (only for register)
    if (!isLogin) {
      const trimmedUsername = formData.username.trim();
      const usernameLength = trimmedUsername.replace(/\s/g, '').length;

      if (!trimmedUsername || usernameLength < 2) {
        newErrors.username = 'Username must be at least 2 characters';
      } else if (usernameLength > 50) {
        newErrors.username = 'Username must be 50 characters or less';
      } else if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
        newErrors.username = 'Username can only contain letters and numbers';
      } else if (/^\d+$/.test(trimmedUsername)) {
        newErrors.username = 'Username cannot be numbers only';
      }

      // Role validation (only for register)
      if (formData.role.length > 20) {
        newErrors.role = 'Role must be 20 characters or less';
      }

      // Phone validation (optional, only for register)
      if (formData.phone && formData.phone.length > 15) {
        newErrors.phone = 'Phone number must be 15 characters or less';
      }
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const url = isLogin 
        ? 'https://localhost:7285/api/User/Login'
        : 'https://localhost:7285/api/User/Register';
      
      const bodyData = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
       console.log(data)
      if (response.ok) {
        if (isLogin) {
          console.log(data)
          // Login successful - save token and redirect
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({
            email: data.email,
            username: data.username,
            role: data.role 
          }));
          setSuccessMessage(`Welcome back, ${data.username}!`);
          // Here you can redirect to dashboard or home page
           window.location.href = '/';
        } else {
          // Registration successful
          setSuccessMessage('User registered successfully! Please login now.');
          setTimeout(() => {
            setIsLogin(true); // Switch to login form
            setSuccessMessage('');
          }, 2000);
        }
        
        setFormData({
          username: '',
          email: '',
          password: '',
          phone: '',
        });
        setErrors({});
      } else {
        if (response.status === 400 || response.status === 401) {
          if (data.errors) {
            const apiErrors = {};
            Object.keys(data.errors).forEach((key) => {
              apiErrors[key.toLowerCase()] = data.errors[key].join(', ');
            });
            setErrors(apiErrors);
          } else {
            setErrors({ general: data.message || (isLogin ? 'Login failed' : 'Registration failed') });
          }
        } else {
          setErrors({ general: 'An unexpected error occurred' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error: Unable to connect to the server' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Toggle Header */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
          <button
            onClick={() => !isLogin && toggleForm()}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-colors ${
              isLogin
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => isLogin && toggleForm()}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-md transition-colors ${
              !isLogin
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Register
          </button>
        </div>

        <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center tracking-wide">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-400 text-center font-medium">
            {successMessage}
          </div>
        )}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-400 text-center font-medium">
            {errors.general}
          </div>
        )}

        <div className="space-y-5">
          {/* Username - Only for Register */}
          {!isLogin && (
            <div>
              <label className="block text-blue-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
          )}

          {/* Email - For both Login and Register */}
          <div>
            <label className="block text-blue-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password - For both Login and Register */}
          <div>
            <label className="block text-blue-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full mt-8 p-3 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSubmitting 
            ? (isLogin ? 'Signing in...' : 'Creating account...') 
            : (isLogin ? 'Sign In' : 'Create Account')
          }
        </button>

        {/* Toggle Link */}
        <p className="mt-5 text-center text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleForm}
            className="text-blue-600 font-semibold hover:underline focus:outline-none"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;