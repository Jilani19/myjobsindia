import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-32 sm:w-40 flex items-center">
                {/* Fallback text if logo.png is missing, but visually hidden if logo loads */}
                <span className="sr-only">MyJobsIndia</span>
                <img 
                  src="/logo.svg" 
                  alt="MyJobsIndia" 
                  className="object-contain h-full w-auto"
                />
              </div>
            </Link>
          </div>
          <div className="hidden sm:flex sm:space-x-6 items-center">
            <Link href="/jobs" className="text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
              Find Jobs
            </Link>
            <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all hover:shadow-md">
              Employer Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
