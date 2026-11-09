import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  UserCheck, 
  ArrowLeft, 
  Upload, 
  FileText, 
  ShieldCheck,
  Loader
} from 'lucide-react';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State Nodes matching database expectations exactly
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualifications: '',
    experience: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    fetchJobMetadata();
  }, [jobId]);

  const fetchJobMetadata = async () => {
    try {
      const res = await axios.get(`https://careertrack-isqj.onrender.com/api/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      toast.error('Failed to locate target placement details.');
      navigate('/');
    } finally {
      setLoadingJob(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Strict Client-Side validation rules enforcement (Assignment 2.B)
    const allowedExtensions = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxBytes = 5 * 1024 * 1024; // 5 Megabytes Limit

    if (!allowedExtensions.includes(file.type)) {
      toast.error('Invalid extension format. Only PDF or DOCX file streams are permitted.');
      e.target.value = null;
      setResumeFile(null);
      return;
    }

    if (file.size > maxBytes) {
      toast.error('Payload scale limit breached. Resume files must sit underneath 5MB.');
      e.target.value = null;
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    toast.success('Resume stream attached and validated safely!');
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload your resume to complete submission.');
      return;
    }

    setSubmitting(true);
    
    // Construct Multi-part raw data streaming payload stack
    const multipartForm = new FormData();
    multipartForm.append('jobId', jobId);
    multipartForm.append('name', formData.name);
    multipartForm.append('email', formData.email);
    multipartForm.append('phone', formData.phone);
    multipartForm.append('qualifications', formData.qualifications);
    multipartForm.append('experience', formData.experience);
    multipartForm.append('resume', resumeFile);

    try {
      const res = await axios.post('https://careertrack-isqj.onrender.com/api/applications/submit', multipartForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(res.data.message || '🎉 Application safely committed to company matrices!');
      
      // Clear tracking form arrays to block user double triggers
      setFormData({ name: '', email: '', phone: '', qualifications: '', experience: '' });
      setResumeFile(null);
      e.target.reset();
    } catch (err) {
      // Catches and alerts server-side structural restrictions (duplicate applications/closed roles)
      const errorMsg = err.response?.data?.message || 'Handshake rejected application processing values.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Parsing Position Schema...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Action Links */}
        <Link to="/" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Opportunity Board
        </Link>

        {/* Double-Panel Workspace Dashboard Layout Grid Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* 🏢 LEFT PANEL: METADATA DETAILS DISPLAY CONTAINER */}
          <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider mb-3">
                {job?.employmentType}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">{job?.title}</h1>
              <p className="text-slate-500 font-bold text-base mt-1">{job?.company}</p>
            </div>

            {/* Quick Metrics Badge Log Array */}
            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 my-2 text-sm font-semibold">
              <div className="flex items-center text-slate-600"><MapPin className="w-4 h-4 mr-2 text-slate-300" /> {job?.location}</div>
              <div className="flex items-center text-slate-600"><DollarSign className="w-4 h-4 mr-2 text-slate-300" /> {job?.salaryRange}</div>
              <div className="flex items-center text-slate-600"><UserCheck className="w-4 h-4 mr-2 text-slate-300" /> {job?.experienceLevel}</div>
              <div className="flex items-center text-slate-600"><Calendar className="w-4 h-4 mr-2 text-slate-300" /> Deadline: {job ? new Date(job.deadline).toLocaleDateString() : ''}</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Role Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{job?.description}</p>
            </div>
          </div>

          {/* 📝 RIGHT PANEL: CANDIDATE REGISTRATION UN-AUTHENTICATED FORM APPLICATION (Assignment 2.B) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="mb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Express Interest</h2>
              <p className="text-slate-400 text-xs mt-0.5">Submit applications instantly. No account required.</p>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <input 
                  type="text" name="name" required placeholder="Full Name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.name} onChange={handleInputChange}
                />
              </div>

              <div>
                <input 
                  type="email" name="email" required placeholder="Email Address"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.email} onChange={handleInputChange}
                />
              </div>

              <div>
                <input 
                  type="text" name="phone" required placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.phone} onChange={handleInputChange}
                />
              </div>

              <div>
                <input 
                  type="text" name="qualifications" required placeholder="Highest Educational Qualification"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.qualifications} onChange={handleInputChange}
                />
              </div>

              <div>
                <textarea 
                  name="experience" required placeholder="Brief summary of professional experience..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-all"
                  value={formData.experience} onChange={handleInputChange}
                />
              </div>

              {/* File Attachment Upload Component Form Block Area Container */}
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/40 rounded-2xl p-4 text-center cursor-pointer transition-colors relative">
                <input 
                  type="file" accept=".pdf,.docx" required
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  {resumeFile ? (
                    <>
                      <FileText className="w-8 h-8 text-emerald-500 animate-bounce" />
                      <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{resumeFile.name}</p>
                      <p className="text-[10px] text-slate-400">Click or drag alternative document streams to swap</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <p className="text-xs font-bold text-slate-600">Attach Resume Data Sheet</p>
                      <p className="text-[10px] text-slate-400">Accepts PDF or DOCX file strings natively (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Data Safety Notice Badge */}
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <span>Your candidate records and file structures remain private.</span>
              </div>

              <button 
                type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/10 hover:from-blue-700 hover:to-purple-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing Submission Streams...</span>
                  </>
                ) : (
                  <span>Submit My Application</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
