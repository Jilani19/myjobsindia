import { MetadataRoute } from 'next';
import { getJobs, Job } from '@/lib/api';

export const revalidate = 0; // Dynamic sitemap every time

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techjobs.example.com';
  
  let jobs: Job[] = [];
  try {
    // Only fetch PUBLISHED jobs for sitemap
    jobs = await getJobs({ status: 'PUBLISHED' });
  } catch (error) {
    console.error('Error fetching jobs for sitemap:', error);
  }

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.postedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...jobUrls,
  ];
}
