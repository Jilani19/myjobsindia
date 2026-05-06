import { getJobs, Job } from '@/lib/api';
import JobCard from '@/components/JobCard';
import { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All Jobs',
  description: 'Browse all available tech jobs and find your next career move.',
};

export default async function JobsPage() {
  let jobs: Job[] = [];
  let apiError = false;
  
  try {
    jobs = await getJobs({ status: 'PUBLISHED' });
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
    apiError = true;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Open Roles</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Find your perfect match from our curated list of opportunities.</p>
      </div>

      <div className="space-y-6">
        {apiError ? (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-lg shadow-sm border border-red-200 dark:border-red-800">
            <h3 className="text-xl font-medium text-red-900 dark:text-red-400 mb-2">Connection Error</h3>
            <p className="text-red-700 dark:text-red-300">We are currently unable to connect to the jobs server. Please ensure the backend is running.</p>
          </div>
        ) : (
          <>
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
            {jobs.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No jobs available</h3>
                <p className="text-slate-500 dark:text-slate-400">Please check back later for new opportunities.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
