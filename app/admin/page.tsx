"use client";

import { useState, useEffect } from 'react';
import { getJobs, createJob, updateJob, deleteJob, retriggerIndexing, Job } from '@/lib/api';
import { Trash2, Edit, Save, CheckCircle2, XCircle, Clock, Globe, RefreshCcw, FileJson, Search, ExternalLink, ShieldAlert, FileText, Send, Copy } from 'lucide-react';

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, companyLogo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const defaultForm = {
    title: '', company: '', companyLogo: '', location: '', salary: '', description: '',
    employmentType: 'FULL_TIME', experience: 'MID_LEVEL', skills: '',
    industry: 'Technology', validThrough: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], applyUrl: '', status: 'DRAFT'
  };
  const [formData, setFormData] = useState<any>(defaultForm);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (job?: Job) => {
    if (job) {
      setEditingId(job._id);
      setFormData({
        ...job,
        skills: job.skills?.join(', ') || '',
        validThrough: new Date(job.validThrough).toISOString().split('T')[0],
      });
    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
    setView('form');
  };

  const handleDuplicate = async (job: Job) => {
    const duplicated = {
      ...job,
      title: `${job.title} (Copy)`,
      slug: undefined,
      status: 'DRAFT',
      _id: undefined,
      indexingStatus: undefined,
      skills: job.skills?.join(', ') || '',
      validThrough: new Date(job.validThrough).toISOString().split('T')[0],
    };
    setEditingId(null);
    setFormData(duplicated);
    setView('form');
  };

  const handleSubmit = async (e: React.FormEvent, intentStatus: string) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const skillsArray = formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      const payload = {
        ...formData,
        status: intentStatus,
        skills: skillsArray,
        validThrough: new Date(formData.validThrough).toISOString()
      };

      let resultJob;
      if (editingId) {
        resultJob = await updateJob(editingId, payload);
      } else {
        resultJob = await createJob(payload);
      }
      
      if (intentStatus === 'PUBLISHED') {
        setActivePipelineId(resultJob._id);
        setTimeout(() => setActivePipelineId(null), 10000);
      }
      
      setView('list');
      await fetchJobs();
      
    } catch (error) {
      alert('Error saving job');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string, currentStatus: string) => {
    const warning = currentStatus === 'PUBLISHED' 
      ? 'Are you sure? This is published and deleting will notify Google to de-index it.'
      : 'Delete this draft job?';
    if (!confirm(warning)) return;
    
    try {
      await deleteJob(id);
      fetchJobs();
    } catch (error) {
      alert('Error deleting job');
    }
  };

  const handleRetrigger = async (id: string) => {
    try {
      setActivePipelineId(id);
      await retriggerIndexing(id);
      await fetchJobs();
      setTimeout(() => setActivePipelineId(null), 5000);
    } catch (err) {
      alert('Failed to retrigger indexing');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const PipelineStatusCard = ({ job }: { job: Job }) => {
    const isNew = activePipelineId === job._id;
    const isSuccess = job.indexingStatus?.status === 'SUCCESS';
    const isFailed = job.indexingStatus?.status === 'FAILED';
    const isSkipped = job.indexingStatus?.status === 'SKIPPED';
    
    return (
      <div className={`mt-4 border rounded-xl overflow-hidden ${isNew ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50/30 dark:bg-blue-900/10' : 'bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700'}`}>
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <RefreshCcw size={16} className={isNew ? 'animate-spin text-blue-500' : 'text-slate-400'} />
            Publishing Pipeline Status
          </div>
          {isNew && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium animate-pulse">Running...</span>}
        </div>
        
        <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2 font-medium text-slate-700 dark:text-slate-300">
              <Globe size={18} className="text-emerald-500" /> SEO
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold"><CheckCircle2 size={16}/> Ready</span>
          </div>

          <div className="flex flex-col items-center p-3 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2 font-medium text-slate-700 dark:text-slate-300">
              <FileJson size={18} className="text-emerald-500" /> Schema
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold"><CheckCircle2 size={16}/> Added</span>
          </div>

          <div className="flex flex-col items-center p-3 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2 font-medium text-slate-700 dark:text-slate-300">
              <FileJson size={18} className="text-emerald-500" /> Sitemap
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold"><CheckCircle2 size={16}/> Updated</span>
          </div>

          <div className="flex flex-col items-center p-3 text-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2 font-medium text-slate-700 dark:text-slate-300">
              <Search size={18} className={isSuccess ? 'text-emerald-500' : isFailed ? 'text-red-500' : 'text-amber-500'} /> Indexing API
            </div>
            {isSuccess ? (
              <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold"><CheckCircle2 size={16}/> Success</span>
            ) : isFailed ? (
              <span className="flex items-center gap-1 text-red-600 text-sm font-bold"><XCircle size={16}/> Failed</span>
            ) : isSkipped ? (
               <span className="flex items-center gap-1 text-amber-600 text-sm font-bold"><ShieldAlert size={16}/> Skipped</span>
            ) : (
              <span className="flex items-center gap-1 text-blue-600 text-sm font-bold"><Clock size={16}/> Pending</span>
            )}
          </div>
        </div>

        {job.indexingStatus && (
          <div className="px-4 py-3 text-xs bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono">
            <h4 className="font-bold mb-2 text-slate-800 dark:text-slate-300">Google Indexing Info</h4>
            <div className="flex flex-col gap-1 mb-4">
              <div><strong>Action:</strong> {job.indexingStatus.indexingType || 'URL_UPDATED'}</div>
              <div><strong>Time:</strong> {job.indexingStatus.lastSubmittedAt ? new Date(job.indexingStatus.lastSubmittedAt).toLocaleString() : 'N/A'}</div>
              {job.indexingStatus.serviceAccountEmail && (
                <div><strong>Service Account:</strong> {job.indexingStatus.serviceAccountEmail}</div>
              )}
              {job.indexingStatus.message && (
                <div className={`${isFailed ? 'text-red-500 font-bold' : isSkipped ? 'text-amber-500' : 'text-emerald-600'}`}>
                  <strong>Response:</strong> {job.indexingStatus.message}
                </div>
              )}
            </div>

            {job.publishingLogs && job.publishingLogs.length > 0 && (
              <>
                <h4 className="font-bold mb-2 text-slate-800 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3">Publishing Pipeline Logs</h4>
                <div className="flex flex-col gap-1">
                  {job.publishingLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-400">[{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                      <span className={log.status === 'SUCCESS' ? 'text-emerald-600' : log.status === 'FAILED' ? 'text-red-500' : 'text-amber-500'}>
                        {log.message} {log.status === 'SUCCESS' ? '✅' : log.status === 'FAILED' ? '❌' : '⏳'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white flex items-center gap-3">
            <div className="h-8 w-auto">
              <img src="/logo.svg" alt="MyJobsIndia" className="h-full w-auto object-contain" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage jobs and monitor Google Indexing API pipeline status in real-time.</p>
        </div>
        {view === 'list' ? (
          <button onClick={() => openForm()} className="btn-primary flex items-center gap-2">
            <FileText size={18} /> Create New Job
          </button>
        ) : (
          <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-700 font-medium">
            &larr; Back to List
          </button>
        )}
      </div>

      {view === 'form' ? (
        <div className="card p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Job' : 'Create New Job'}</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input type="text" name="company" required value={formData.company} onChange={handleChange} className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Logo</label>
                <div className="flex items-center gap-3">
                  {formData.companyLogo && (
                    <img src={formData.companyLogo} alt="Logo" className="w-10 h-10 object-contain bg-white border rounded p-1" />
                  )}
                  <input type="file" accept="image/png, image/jpeg, image/webp, image/svg+xml" onChange={handleLogoUpload} className="w-full p-1.5 border rounded dark:border-slate-600 dark:bg-slate-800 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input type="text" name="salary" required value={formData.salary} onChange={handleChange} placeholder="e.g. $100k - $120k" className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employment Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800">
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACTOR">Contractor</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Valid Through</label>
                <input type="date" name="validThrough" required value={formData.validThrough} onChange={handleChange} className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skills (Comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, TypeScript" className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.split(',').map((s: string, i: number) => s.trim() ? (
                    <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{s.trim()}</span>
                  ) : null)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">External Apply URL (Optional)</label>
              <input type="url" name="applyUrl" value={formData.applyUrl} onChange={handleChange} placeholder="https://company.com/careers/apply/123" className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" required rows={6} value={formData.description} onChange={handleChange} className="w-full p-2 border rounded dark:border-slate-600 dark:bg-slate-800"></textarea>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-4 justify-end">
              <button 
                type="button" 
                onClick={(e) => handleSubmit(e, 'DRAFT')} 
                disabled={processing} 
                className="btn-primary bg-slate-500 hover:bg-slate-600 flex items-center gap-2"
              >
                <Save size={18} /> {processing ? 'Saving...' : 'Save Draft'}
              </button>
              <button 
                type="button" 
                onClick={(e) => handleSubmit(e, 'PUBLISHED')} 
                disabled={processing} 
                className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Send size={18} /> {processing ? 'Publishing...' : 'Publish Live'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={fetchJobs} className="text-sm flex items-center gap-1 text-slate-500 hover:text-blue-600">
              <RefreshCcw size={14} /> Refresh Data
            </button>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center"><RefreshCcw className="animate-spin text-blue-500" size={32} /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <Globe className="mx-auto text-slate-400 mb-3" size={48} />
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No jobs exist</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Create your first job to start the publishing pipeline.</p>
              <button onClick={() => openForm()} className="mt-4 btn-primary">Create Job</button>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map(job => (
                <div key={job._id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800/80 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-10 h-10 object-contain bg-white border rounded p-1 mt-1" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border rounded flex items-center justify-center mt-1">
                          <Globe size={18} className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            job.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {job.status}
                          </span>
                          {job.status === 'PUBLISHED' && (
                            <a href={`/jobs/${job.slug}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 transition-colors" title="View Public Page">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">{job.company} &bull; {job.location}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Slug: /jobs/{job.slug}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => openForm(job)} className="p-2 border rounded bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" title="Edit Job">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDuplicate(job)} className="p-2 border rounded bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" title="Duplicate Job">
                        <Copy size={16} />
                      </button>
                      {job.status === 'PUBLISHED' && (
                        <button onClick={() => handleRetrigger(job._id)} className="p-2 border rounded bg-white hover:bg-blue-50 text-blue-600 border-blue-200" title="Retrigger Google Indexing">
                          <RefreshCcw size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(job._id, job.status)} className="p-2 border rounded bg-white hover:bg-red-50 text-red-600 border-red-200" title="Delete Job">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {job.status === 'PUBLISHED' && <PipelineStatusCard job={job} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
