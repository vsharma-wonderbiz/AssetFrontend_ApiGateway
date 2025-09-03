
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';

const AuthForm = () => {
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
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

    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must be 100 characters or less';
    }

    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && 
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]).{8,15}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        'Password must be 8-15 characters and include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character';
    }

 
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
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    
    // Validate form before sending request
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Don't send request if validation fails
    }

    // Clear any previous errors since validation passed
    setErrors({});
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const data = await response.json();
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({
            email: data.email,
            username: data.username,
            role: data.role
          }));
          toast.success(`Welcome back, ${data.username}!`);
          setSuccessMessage(`Welcome back, ${data.username}!`);
          
          window.location.href = '/Dashboard';
        } else {
          
          toast.success('User registered successfully! Please login now.')
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage('');
          }, 2000);
        }

        setFormData({ username: '', email: '', password: '' });
        setErrors({});
      } else {
        // Get backend exception message as text
        const errorMessage = await response.text();
        toast.error(errorMessage)
      }
    } catch (error) {
      // Network or other unexpected error
      setErrors({ general: 'Network error: Unable to connect to the server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:20px_20px] opacity-20"></div>
      
      <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        {/* Brand Header */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">SecureAuth</h1>
          <p className="text-slate-600 text-sm">Enterprise Authentication Portal</p>
        </div> */}

        {/* Toggle Header */}
        <div className="flex bg-slate-100/80 backdrop-blur-sm rounded-xl p-1.5 mb-8 border border-slate-200/50">
          <button
            onClick={() => !isLogin && toggleForm()}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isLogin
                ? 'bg-white text-blue-700 shadow-md border border-blue-100'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowRight className={`h-4 w-4 transition-transform ${isLogin ? 'rotate-0' : 'rotate-180'}`} />
              Sign In
            </div>
          </button>
          <button
            onClick={() => isLogin && toggleForm()}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
              !isLogin
                ? 'bg-white text-blue-700 shadow-md border border-blue-100'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              Register
            </div>
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-slate-800 text-center">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center font-medium shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              {successMessage}
            </div>
          </div>
        )}
        
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-center font-medium shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {errors.general}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Username - Only for Register */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-slate-700 font-semibold text-sm" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                    errors.username 
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2" role="alert">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {errors.username}
                </p>
              )}
            </div>
          )}

          {/* Email - For both Login and Register */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-semibold text-sm" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-2" role="alert">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password - For both Login and Register */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-semibold text-sm" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-16 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                  errors.password 
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-blue-500 transition-colors duration-200 p-1 rounded-lg hover:bg-slate-100"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-2" role="alert">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full mt-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed hover:transform-none' : 'hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </div>
        </button>

        {/* Toggle Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={toggleForm}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {isLogin ? 'Create one here' : 'Sign in instead'}
          </button>
        </div>

        {/* Security Badge */}
        {/* <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield className="h-3 w-3" />
          <span>256-bit SSL Encrypted</span>
        </div> */}
      </div>
    </div>
  );
};

export default AuthForm;