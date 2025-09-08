"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

export default function LoginPage() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("admin@exiby.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column - Slogan */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-center p-8 lg:p-16">
          <div className="max-w-lg text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-3xl flex items-center justify-center shadow-2xl">
                <Calendar className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#0077ED] via-[#4A9AFF] to-[#0077ED] bg-clip-text text-transparent">
                ExiBy
              </span>
            </h1>

            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Event Management
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Streamline your events, connect with organizations, and manage
              attendees all in one powerful platform.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Seamless Event Creation
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Organization Management
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Real-time Analytics
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="col-span-12 lg:col-span-6 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Sign in to your account
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077ED] focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your password"
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
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#0077ED] to-[#4A9AFF] hover:from-[#0066CC] hover:to-[#3A8AEF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077ED] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

                         </div>
          </div>
        </div>
      </div>
    </div>
  );
}
