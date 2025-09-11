import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

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

 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch("https://localhost:7285/api/User/me", {
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();

        // Normalize user data
        const normalizedUser = {
          username: user.username || user.name || "",
          role: user.role || "User",
        };

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        console.log("Google Username:", normalizedUser.username);
        console.log("Google Role:", normalizedUser.role);

        // Redirect to Dashboard
        // window.location.href = "/Dashboard";
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user after Google login:", err);
    }
  };

  const params = new URLSearchParams(window.location.search);
  if (params.has("code") || params.has("state")) {
    // Run fetch after 4 seconds
    setTimeout(() => {
      fetchUserData();
    }, 4000);
  }
}, []);


  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
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
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!isLogin) {
      if (!formData.username || formData.username.length < 2) {
        newErrors.username = 'Username must be at least 2 characters';
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
        credentials: 'include',
      });

      if (response.ok) {
        if (isLogin) {
          // Fetch user data from /api/User/me after successful login
          const userResponse = await fetch('https://localhost:7285/api/User/me', {
            credentials: 'include',
          });

          if (userResponse.ok) {
            const user = await userResponse.json();
            // Normalize user data
            const normalizedUser = {
              username: user.username || user.name || "",
              role: user.role || "User",
            };
            console.log("Storing in localStorage:", normalizedUser);
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(normalizedUser));

            toast.success('Login successful!');

            setTimeout(() => {
              window.location.href = '/Dashboard';
            }, 1000);
          } else {
            throw new Error("Failed to fetch user data after login");
          }
        } else {
          toast.success('Registration successful! Please login now.');
          setSuccessMessage('Registration successful! You can now sign in.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage('');
          }, 2000);
        }

        setFormData({ username: '', email: '', password: '' });
        setErrors({});
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error: Unable to connect to the server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'https://localhost:7285/api/User/login-google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:20px_20px] opacity-20"></div>

      <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-lg">
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
              <ArrowRight
                className={`h-4 w-4 transition-transform ${
                  isLogin ? 'rotate-0' : 'rotate-180'
                }`}
              />
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

        {isLogin && (
          <div className="mb-6">
            <button
              onClick={handleGoogleSignup}
              className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 group"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-slate-700 group-hover:text-slate-800">
                  Sign in with Google
                </span>
              </div>
            </button>

            <div className="mt-6 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <div className="px-4 text-sm text-slate-500 bg-white">or</div>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>
          </div>
        )}

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
                  className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>
          )}

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
                className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
          </div>

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
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-16 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                placeholder="Enter your password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-blue-500 transition-colors duration-200 p-1 rounded-lg hover:bg-slate-100"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full mt-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <div className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>{isLogin ? 'Sign In' : 'Register'}</>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default AuthForm;