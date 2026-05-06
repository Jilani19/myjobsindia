import Link from 'next/link';
import { getJobs, Job } from '@/lib/api';
import JobCard from '@/components/JobCard';

export const revalidate = 0; // Ensure fresh data on home

export default async function Home() {
  let jobs: Job[] = [];
  let apiError = false;
  
  let errorMessage = '';
  
  try {
    jobs = await getJobs({ status: 'PUBLISHED' });
  } catch (err: any) {
    console.error('Failed to fetch jobs on home:', err);
    apiError = true;
    errorMessage = err.message || 'Unknown error';
  }

  const featuredJobs = jobs.slice(0, 3);

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            The Premium Job Platform for <br/><span className="text-blue-400">India's Best Talent</span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Discover top opportunities in software, business, and enterprise roles at leading companies across India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/jobs" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              Browse All Jobs
            </Link>
            <Link href="/admin" className="bg-blue-700/50 backdrop-blur-sm border border-blue-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600/50 transition-colors">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Opportunities</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Latest jobs from top companies</p>
            </div>
            <Link href="/jobs" className="text-blue-600 dark:text-blue-400 font-medium hover:underline hidden sm:block">
              View all jobs &rarr;
            </Link>
          </div>
          
          <div className="space-y-6">
            {apiError ? (
              <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-lg shadow-sm border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 font-medium">Temporarily unable to connect to the job database. Please try again later.</p>
                <p className="text-red-500 text-sm mt-2 font-mono">{errorMessage}</p>
              </div>
            ) : (
              <>
                {featuredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
                {featuredJobs.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No jobs posted yet.</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link href="/jobs" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              View all jobs &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
