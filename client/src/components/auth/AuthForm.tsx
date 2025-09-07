// components/AuthForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Building2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthFormData } from '@/types/auth.types';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

const AuthForm: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: ''
  });

  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuth();

  useEffect(() => {
    clearError();
    setFormData({ name: '', email: '', password: '' });
  }, [isLogin, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password) return 'Please fill in all required fields';
    if (!isLogin && !formData.name) return 'Please provide your name';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email address';
    if (formData.password.length < 6) return 'Password must be at least 6 characters long';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return;

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({ name: formData.name!, email: formData.email, password: formData.password });
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const inputClass = clsx(
    'block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
    {
      'bg-white text-gray-900 border-gray-300 placeholder-gray-400': !isDark,
      'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-500': isDark
    }
  );

  const iconClass = clsx('h-5 w-5', { 'text-gray-400': !isDark, 'text-gray-500': isDark });

  if (isAuthenticated) {
    return (
      <div className={clsx('min-h-screen flex items-center justify-center p-4', {
        'bg-gradient-to-br from-green-50 to-emerald-100': !isDark,
        'bg-gradient-to-br from-gray-800 to-gray-900': isDark
      })}>
        <div className={clsx('rounded-xl shadow-lg p-8 text-center', {
          'bg-white': !isDark,
          'bg-gray-900': isDark
        })}>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className={clsx('text-2xl font-bold mb-2', { 'text-gray-900': !isDark, 'text-gray-100': isDark })}>Welcome!</h2>
          <p className={clsx({ 'text-gray-600': !isDark, 'text-gray-300': isDark })}>
            You are now logged in to the visitor management system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('min-h-screen flex items-center justify-center p-4', {
      'bg-gradient-to-br from-blue-50 to-indigo-100': !isDark,
      'bg-gradient-to-br from-gray-900 to-gray-800': isDark
    })}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className={clsx('text-3xl font-bold', { 'text-gray-900': !isDark, 'text-gray-100': isDark })}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={clsx('mt-2 text-sm', { 'text-gray-600': !isDark, 'text-gray-300': isDark })}>
            {isLogin ? 'Sign in to your visitor management account' : 'Join our visitor management system'}
          </p>
        </div>

        {/* Form Card */}
        <div className={clsx('rounded-xl shadow-lg p-8', { 'bg-white': !isDark, 'bg-gray-900': isDark })}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className={clsx('block text-sm font-medium mb-2', { 'text-gray-700': !isDark, 'text-gray-200': isDark })}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={iconClass} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className={clsx('block text-sm font-medium mb-2', { 'text-gray-700': !isDark, 'text-gray-200': isDark })}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={iconClass} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={clsx('block text-sm font-medium mb-2', { 'text-gray-700': !isDark, 'text-gray-200': isDark })}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={iconClass} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className={iconClass} /> : <Eye className={iconClass} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={clsx('flex items-center space-x-2 p-3 border rounded-lg', {
                'bg-red-50 border-red-200 text-red-700': !isDark,
                'bg-red-900 border-red-700 text-red-300': isDark
              })}>
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Switch Form */}
          <div className="mt-6 text-center">
            <p className={clsx('text-sm', { 'text-gray-600': !isDark, 'text-gray-300': isDark })}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isLoading}
                className={clsx('ml-2 font-medium transition-colors', {
                  'text-indigo-600 hover:text-indigo-500': !isDark,
                  'text-indigo-400 hover:text-indigo-300': isDark
                })}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Forgot Password (Login only) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className={clsx('text-sm transition-colors', {
                  'text-indigo-600 hover:text-indigo-500': !isDark,
                  'text-indigo-400 hover:text-indigo-300': isDark
                })}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={clsx('text-xs', { 'text-gray-500': !isDark, 'text-gray-400': isDark })}>
            By signing {isLogin ? 'in' : 'up'}, you agree to our{' '}
            <a href="#" className={clsx('hover:text-indigo-500', { 'text-indigo-600': !isDark, 'text-indigo-400 hover:text-indigo-300': isDark })}>Terms of Service</a>{' '}
            and{' '}
            <a href="#" className={clsx('hover:text-indigo-500', { 'text-indigo-600': !isDark, 'text-indigo-400 hover:text-indigo-300': isDark })}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
