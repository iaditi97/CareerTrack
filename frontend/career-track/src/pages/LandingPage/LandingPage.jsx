import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Analytics from './components/Analytics';
import Footer from './components/Footer';
import { Search, MapPin, Briefcase, Calendar, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveJobs();
  }, [type]); // Re-fetch data whenever a filter classification state shifts

  const fetchLiveJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        params: { search, type }
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Error loading public platform placement entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLiveJobs();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
        <Header />
        <Hero />
        <Features />
        <Analytics />
        {/* 🚀 DYNAMIC CAREER EXPLORER BOARD INSTANTIATION (Assignment 2.A) */}
        {/* 🔗 ADDED id="job-board-anchor" AND scroll-mt-24 TO ENABLE THE SMOOTH SCROLL BUTTON */}
        <div id="job-board-anchor" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Live Opportunities</h2>
            <p className="text-slate-500 text-sm mt-2">Browse published and active openings without creating an account.</p>
          </div>

          {/* 🔍 Search & Filtering Bar Interface Control */}
          <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by job title, company name, or keywords..." 
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white bg-slate-50/50 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            
            <select 
              className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-all">
              Find Jobs
            </button>
          </form>

          {/* 💼 Real-time Job Grid Listings */}
          {loading ? (
            <div className="text-center text-slate-400 py-12 font-medium flex flex-col items-center gap-2">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span>Querying active marketplace postings...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-slate-400 py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <p className="font-bold text-slate-500 text-base">No open roles found matching your constraints</p>
              <p className="text-xs text-slate-400 mt-1">Try broadening your tracking search strings or choosing a different employment filter tier.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        job.employmentType === 'Full-time' ? 'bg-blue-50 text-blue-700' :
                        job.employmentType === 'Remote' ? 'bg-purple-50 text-purple-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {job.employmentType}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{job.salaryRange}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mt-3 tracking-tight">{job.title}</h3>
                    <p className="text-slate-500 font-bold text-sm">{job.company}</p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-300" /> {job.location}</div>
                      <div className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-slate-300" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                    </div>
                  </div>

                    <Link 
                    to={`/job/${job._id}`}
                    className="mt-5 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 group transition-all"
                    >
                    <span>View Posting Particulars</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
    </div>
  );
};

export default LandingPage;
