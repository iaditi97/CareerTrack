import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Briefcase, 
  Users, 
  LogOut, 
  Download, 
  FileText, 
  CheckCircle, 
  ChevronRight,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    if (!token) {
      navigate('/login');
      return;
    }
    setAdminEmail(email || 'Admin Console');
    loadActiveJobs();
  }, [navigate]);

  const loadActiveJobs = async () => {
    try {
      const res = await axios.get('https://careertrack-isqj.onrender.com/api/jobs', { params: { limit: 100 } });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleJobSelect = async (jobId) => {
    setSelectedJobId(jobId);
    if (!jobId) {
      setApplications([]);
      return;
    }
    
    setLoadingApps(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`https://careertrack-isqj.onrender.com/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data.records || []);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusChange = async (appId, newStatus, currentNotes) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`https://careertrack-isqj.onrender.com/api/applications/${appId}/status`, 
        { status: newStatus, notes: currentNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleJobSelect(selectedJobId);
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleExportCSV = () => {
    if (!selectedJobId) return;
    window.open(`https://careertrack-isqj.onrender.com/api/applications/job/${selectedJobId}/export`, '_blank');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12 relative z-10">
      
      {/* Navbar Section */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl text-white">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">JobPortal</span>
            <span className="text-xs font-bold text-slate-400 block -mt-1 uppercase tracking-widest">Workspace</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Staff</p>
            <p className="text-sm font-semibold text-slate-700">{adminEmail}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all cursor-pointer z-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
        
        {/* Analytics Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Postings</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{jobs.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Briefcase className="w-6 h-6" /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Applicants</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{applications.length}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Users className="w-6 h-6" /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Pipeline</p>
              <p className="text-sm font-bold text-emerald-600 flex items-center mt-3 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit"><TrendingUp className="w-4 h-4 mr-1"/> REST Node Gateway Live</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle className="w-6 h-6" /></div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8 relative z-30">
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Position Matrix:</label>
            <select 
              className="w-full sm:w-80 p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-semibold transition-all cursor-pointer relative z-40"
              value={selectedJobId} 
              onChange={(e) => handleJobSelect(e.target.value)}
            >
              <option value="">-- Select Active Posting Context Node --</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title} • {job.company}</option>
              ))}
            </select>
          </div>

          {selectedJobId && applications.length > 0 && (
            <button 
              onClick={handleExportCSV}
              className="w-full md:w-auto bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Applicants Stream (.CSV)</span>
            </button>
          )}
        </div>

        {/* Candidates Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loadingApps ? (
            <div className="p-16 text-center text-slate-400 text-sm font-semibold flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span>Loading applications...</span>
            </div>
          ) : !selectedJobId ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              <Inbox className="w-12 h-12 text-slate-300" />
              <p className="font-bold text-slate-500">No Target Focus Assigned</p>
              <p className="text-xs text-slate-400 max-w-xs">Please pick an active job position deployment route above to load your screening pipelines.</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              <FileText className="w-12 h-12 text-slate-300" />
              <p className="font-bold text-slate-500">Zero Applications Tracked</p>
              <p className="text-xs text-slate-400">No candidates have applied to this specific posting deployment matrix yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="p-4 pl-6">Candidate Information</th>
                    <th className="p-4">Background / Summary</th>
                    <th className="p-4">Pipeline Status Flow</th>
                    <th className="p-4 pr-6">Internal Staff Annotation Ledger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {applications.map(app => (
                    <tr key={app._id} className="hover:bg-slate-50/40 transition duration-150">
                      <td className="p-4 pl-6 max-w-xs">
                        <p className="font-bold text-slate-900 text-base">{app.name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{app.email}</p>
                        <p className="text-slate-400 text-xs">{app.phone}</p>
                        <a 
                          href={`https://careertrack-isqj.onrender.com/${app.resumePath}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 mt-2 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          <span>View Resume Document</span>
                        </a>
                      </td>

                      <td className="p-4">
                        <p className="text-slate-700 font-semibold">{app.qualifications}</p>
                        <p className="text-slate-400 text-xs mt-1 bg-slate-100 px-2 py-0.5 rounded-md w-fit">Experience: {app.experience}</p>
                      </td>

                      <td className="p-4">
                        <select 
                          className={`p-2 border rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                            app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            app.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value, app.notes)}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="p-4 pr-6">
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            placeholder="Add evaluation comments..."
                            defaultValue={app.notes} 
                            onBlur={(e) => handleStatusChange(app._id, app.status, e.target.value)}
                            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          />
                          <ChevronRight className="w-3.5 h-3.5 absolute right-3 text-slate-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
