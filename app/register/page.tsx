'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  server?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.first_name.trim())) {
      newErrors.first_name = 'First name can only contain letters and spaces';
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.last_name.trim())) {
      newErrors.last_name = 'Last name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear server error when user makes changes
    if (errors.server) {
      setErrors(prev => ({ ...prev, server: undefined }));
    }
  };

  const simulateServerRegistration = async (data: FormData): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate server-side validation errors
    if (data.email === 'admin@exiby.com') {
      return { success: false, error: 'This email is already registered. Please use a different email address.' };
    }
    
    if (data.email.includes('test@')) {
      return { success: false, error: 'Registration temporarily unavailable. Please try again later.' };
    }
    
    // Simulate successful registration
    return { success: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await simulateServerRegistration(formData);
      
      if (result.success) {
        setShowSuccess(true);
        // Redirect to login after showing success message
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 2000);
      } else {
        setErrors({ server: result.error });
      }
    } catch (error) {
      setErrors({ server: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: keyof FormErrors) => errors[field];
  const hasFieldError = (field: keyof FormErrors) => !!errors[field];

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your account has been created successfully. You will be redirected to the login page shortly.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg ">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Join ExiBy
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create your account and start managing events
            </p>
          </div>

          {/* Server Error */}
          {errors.server && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{errors.server}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 ${hasFieldError('first_name') ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      hasFieldError('first_name')
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                {hasFieldError('first_name') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {getFieldError('first_name')}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 ${hasFieldError('last_name') ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      hasFieldError('last_name')
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
                {hasFieldError('last_name') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {getFieldError('last_name')}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${hasFieldError('email') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    hasFieldError('email')
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {hasFieldError('email') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${hasFieldError('password') ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    hasFieldError('password')
                      ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {hasFieldError('password') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{getFieldError('password')}</span>
                </p>
              )}
              {!hasFieldError('password') && formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      Contains uppercase, lowercase, and number
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <button type="button" className="font-medium text-purple-600 hover:text-purple-500 underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="font-medium text-purple-600 hover:text-purple-500 underline">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
}