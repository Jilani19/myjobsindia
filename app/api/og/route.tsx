import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title')?.slice(0, 100) || 'Premium Job Opportunity';
    const company = searchParams.get('company')?.slice(0, 100) || 'MyJobsIndia Partner';
    const location = searchParams.get('location')?.slice(0, 100) || 'Remote / On-site';
    const logoUrl = searchParams.get('logoUrl');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#3b82f6', fontSize: 70, fontWeight: 900, letterSpacing: '-0.05em' }}>MyJobs</span>
            <span style={{ color: '#ffffff', fontSize: 70, fontWeight: 900, letterSpacing: '-0.05em' }}>India</span>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              height: '100%',
              flex: 1,
              paddingRight: '40px',
            }}
          >
            {logoUrl && (
              <img 
                src={logoUrl} 
                width="80" 
                height="80" 
                style={{ objectFit: 'contain', marginBottom: '24px', borderRadius: '12px', backgroundColor: 'white', padding: '10px' }} 
              />
            )}
            <h1
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              {title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontSize: 36, color: '#3b82f6', fontWeight: 800, margin: 0, marginRight: '40px' }}>
                🏢 {company}
              </p>
              <p style={{ fontSize: 36, color: '#64748b', fontWeight: 600, margin: 0 }}>
                📍 {location}
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
