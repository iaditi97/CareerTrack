import React from 'react';
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    // 📡 DYNAMIC ACCESS: Check if an active token and email exist in the browser memory
    const token = localStorage.getItem('adminToken');
    const adminEmail = localStorage.getItem('adminEmail');
    
    // Dynamically derive if the administrator is logged in or out
    const isAuthenticated = !!token; 
    
    // Clean user format mapping back to your existing template markup
    const user = { 
        fullName: adminEmail ? adminEmail.split('@')[0] : "Admin", 
        role: "employer" 
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo - Clickable to return Home */}
                    <div 
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => navigate("/")}
                    >       
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white"/>
                        </div>
                        <span className="text-xl font-bold text-gray-900">JobPortal</span>
                    </div>    

                    {/* Navigation Links - Hidden on mobile */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {/* Smooth scroll to our job grid anchor point */}
                        <a 
                            href="#job-board-anchor"
                            className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
                        >
                            Find Jobs 
                        </a>
                        
                        <span
                            onClick={() => {
                                navigate(isAuthenticated ? "/employer-dashboard" : "/login");
                            }}
                            className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
                        >
                            For Employers
                        </span>
                    </nav> 

                    {/* Dynamic Auth Section */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-700 text-sm font-medium hidden sm:inline">
                                    Welcome, <span className="capitalize">{user.fullName}</span>
                                </span>
                                <span
                                    onClick={() => navigate("/employer-dashboard")}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer text-sm"
                                >
                                    Dashboard
                                </span>  
                            </div>
                        ) : (
                            <>
                                <span 
                                    onClick={() => navigate("/login")}
                                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                                >
                                    Login
                                </span>
                                <span 
                                    onClick={() => navigate("/signup")}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer text-sm"
                                >
                                    Sign Up  
                                </span>  
                            </>              
                        )}
                    </div>  

                </div>
            </div>  
        </motion.header>
    );
};

export default Header;
