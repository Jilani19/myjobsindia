import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { Job } from '@/lib/api';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const datePosted = new Date(job.postedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link href={`/jobs/${job.slug}`} className="block group">
      <div className="card p-6 border-l-4 border-l-transparent group-hover:border-l-blue-600 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain bg-white border rounded p-1 flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 border rounded flex items-center justify-center flex-shrink-0">
                <Briefcase size={20} className="text-slate-400" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {job.title}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">{job.company}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <MapPin size={16} />
              {job.location}
            </span>
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <DollarSign size={16} />
              {job.salary}
            </span>
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <Briefcase size={16} />
              {job.employmentType}
            </span>
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <Clock size={16} />
              {datePosted}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
