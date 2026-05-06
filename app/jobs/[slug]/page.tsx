import { getJobBySlug } from '@/lib/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, DollarSign, Briefcase, Calendar, Building, ExternalLink } from 'lucide-react';

export const revalidate = 0;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const job = await getJobBySlug(params.slug);
    
    if (!job) {
      return { title: 'Job Not Found' };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myjobsindia.com';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    const logoUrlParam = job.companyLogo ? `&logoUrl=${encodeURIComponent(`${apiBaseUrl}/jobs/${job.slug}/logo`)}` : '';
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&location=${encodeURIComponent(job.location)}${logoUrlParam}`;

    return {
      title: `${job.title} at ${job.company}`,
      description: `Apply for the ${job.title} position at ${job.company}. Location: ${job.location}. Salary: ${job.salary}. ${job.employmentType}.`,
      alternates: {
        canonical: `${baseUrl}/jobs/${job.slug}`,
      },
      openGraph: {
        title: `${job.title} at ${job.company} | MyJobsIndia`,
        description: `We are hiring a ${job.title} in ${job.location}. View details and apply now!`,
        url: `${baseUrl}/jobs/${job.slug}`,
        type: 'website',
        siteName: 'MyJobsIndia',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${job.title} at ${job.company}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${job.title} at ${job.company}`,
        description: `Apply for the ${job.title} role. Location: ${job.location}.`,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    return { title: 'Job Not Found' };
  }
}

export default async function JobDetailsPage({ params }: Props) {
  let job;
  try {
    job = await getJobBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  if (!job) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myjobsindia.com';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

  const datePosted = new Date(job.postedAt).toISOString();
  const validThroughDate = new Date(job.validThrough).toISOString();

  // JobPosting JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: job.company,
      value: job.slug
    },
    datePosted: datePosted,
    validThrough: validThroughDate,
    employmentType: job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: baseUrl,
      logo: job.companyLogo ? `${apiBaseUrl}/jobs/${job.slug}/logo` : ''
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location
      }
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        value: job.salary,
        unitText: 'YEAR'
      }
    },
    skills: job.skills && job.skills.length > 0 ? job.skills.join(', ') : undefined,
    directApply: !!job.applyUrl
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div className="flex items-start gap-5">
                {job.companyLogo && (
                  <img src={job.companyLogo} alt={`${job.company} logo`} className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white border border-slate-100 rounded-xl p-2 shadow-sm flex-shrink-0" />
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{job.title}</h1>
                  <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">{job.company}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200">
                <MapPin size={18} className="text-slate-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200">
                <DollarSign size={18} className="text-slate-400" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200">
                <Briefcase size={18} className="text-slate-400" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200">
                <Calendar size={18} className="text-slate-400" />
                <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Job Description</h2>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {job.description}
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Skills & Requirements</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Applications close on {new Date(job.validThrough).toLocaleDateString()}
                </p>
              </div>
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm"
                >
                  Apply Now <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
