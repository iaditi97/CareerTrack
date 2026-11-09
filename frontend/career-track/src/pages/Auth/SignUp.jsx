import React, { useState } from 'react'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { validateAvatar, validateEmail, validatePassword } from '../../utils/helper';

const SignUp = () => {
  const navigate = useNavigate(); // 🔗 FIXED: Core navigation hook instantiated cleanly

  const [formData, setFormData] = useState ({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState ({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
    success: false,
  });

   // Handle input changes
    const handleInputChange = (e) => { 
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formState.errors[name]) {
            setFormState(prev => ({
                ...prev,
                errors: { ...prev.errors, [name]: '' }
            }));
        }
    };

    const handleRoleChange = (role) => {
      setFormData((prev) => ({ ...prev, role }));
      if (formState.errors.role) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, role: "" },
        }));
      }
    };

    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const error = validateAvatar(file);
        if (error) {
          setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, avatar: error },
          }));
          return;
        }
        setFormData((prev) => ({ ...prev, avatar: file }));

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormState((prev) => ({
            ...prev,
            avatarPreview: e.target.result,
            errors: { ...prev.errors, avatar: "" },
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    const validateForm = () => {
      const errors = {
        fullName: !formData.fullName ? "Enter full name" : "",
        email: validateEmail(formData.email),
        password: validatePassword(formData.password),
        role: !formData.role ? "Please select a role" : "",
        avatar: "",
      };

      // Remove empty errors
      Object.keys(errors).forEach((key) => {
        if (!errors[key]) delete errors[key];
      });

      setFormState((prev) => ({ ...prev, errors }));
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setFormState((prev) => ({ ...prev, loading: true }));

      try {
        // 📡 Connects directly to the backend Auth registration endpoint
        const response = await axios.post('https://careertrack-isqj.onrender.com/api/auth/register', {
          email: formData.email,
          password: formData.password
        });

        if (response.data.token) {
          // Store authentication context variables inside local browser storage
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('adminEmail', response.data.email);

          // Trigger your beautiful success state screen animation
          setFormState((prev) => ({
            ...prev,
            loading: false,
            success: true,
          }));

          // Allow the redirection countdown animation to run smoothly for 2.5 seconds
          setTimeout(() => {
            navigate('/employer-dashboard');
          }, 2500);
        }

      } catch (error) {
        console.log("error", error);

        setFormState((prev) => ({
          ...prev,
          loading: false,
          errors: {
            submit:
              error.response?.data?.message ||
              "Registration failed. Please try again.",
          },
        }));
      }
    };

    if (formState.success) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div 
            initial= {{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
            >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Account Created!</h2>
                <p className="text-gray-600 mb-4">
                    Welcome to JobPortal! Your account has been successfully created. 
                </p>
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-gray-500 mt-2"> 
                  Redirecting to your dashboard...</p>
            </motion.div>
        </div>
        );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-sm text-gray-600">
              Join thousands of professionals finding their dream jobs 
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
           {/* Full Name */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
                 Full Name *
             </label>
             <div className="relative"> 
             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                formState.errors.fullName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your full name"
              />
           </div>
                {formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1 items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.fullName}
                </p>
              )}
           </div> 
                  
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${ 
                      formState.errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Enter your email"
                    />
                </div>
                {formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formState.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div> 
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type={formState.showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border ${ 
                      formState.errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {formState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formState.errors.password}
                  </p>
                )}
              </div>

                         {/* Role Selection Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Job Seeker Box Card */}
                  <div 
                    onClick={() => handleRoleChange('jobseeker')}
                    className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 ${
                      formData.role === 'jobseeker' 
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserCheck className="w-6 h-6 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">Job Seeker</span>
                    <span className="text-xs text-gray-500">Looking for opportunities</span>
                  </div>

                                   {/* Employer Box Card */}
                  <div 
                    onClick={() => handleRoleChange('employer')}
                    className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 ${
                      formData.role === 'employer' 
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className="w-6 h-6 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">Employer</span>
                    <span className="text-xs text-gray-500">Hiring talent</span>
                  </div>
                </div>
                {formState.errors.role && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formState.errors.role}
                  </p>
                )}
              </div>

              {/* Submit Error Handling Alert Banner */}
              {formState.errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {formState.errors.submit}
                  </p>
                </div>
              )}

              {/* Submit Action Trigger Button */}
              <button
                type="submit"
                disabled={formState.loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm shadow-md"
              >
                {formState.loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              {/* Footer Shift Switcher Link */}
              <div className="text-center text-sm mt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <span onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                    Sign in here
                  </span>
                </p>
              </div>

            </form>
          </motion.div>
        </div>
    ); 
};

export default SignUp;
