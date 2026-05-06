export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api').replace('localhost', '127.0.0.1');

export interface IndexingStatus {
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'SKIPPED';
  lastSubmittedAt?: string;
  serviceAccountEmail?: string;
  message?: string;
  indexingType?: string;
}

export interface PublishingLog {
  message: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface Job {
  _id: string;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  description: string;
  employmentType: string;
  experience: string;
  skills: string[];
  industry: string;
  validThrough: string;
  postedAt: string;
  applyUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  indexingStatus?: IndexingStatus;
  publishingLogs?: PublishingLog[];
}

export async function getJobs(params?: { status?: string }): Promise<Job[]> {
  let url = `${API_URL}/jobs`;
  if (params && params.status) {
    url += `?status=${params.status}`;
  }
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch jobs`);
    return res.json();
  } catch (error: any) {
    throw new Error(`Fetch failed for URL [${url}]. Reason: ${error.message}`);
  }
}

export async function getJobBySlug(slug: string): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch job');
  return res.json();
}

export async function createJob(jobData: Partial<Job>): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error('Failed to create job');
  return res.json();
}

export async function updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error('Failed to update job');
  return res.json();
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/jobs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete job');
}

export async function retriggerIndexing(id: string): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${id}/index`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to retrigger indexing');
  return res.json();
}
