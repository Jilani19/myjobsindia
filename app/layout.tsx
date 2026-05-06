import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MyJobsIndia - Premium Job Platform",
    template: "%s | MyJobsIndia",
  },

  description:
    "Discover the best jobs. Apply to premium roles at top companies via MyJobsIndia.",

  verification: {
    google: "12GwRiTwfERCxLfI_WI8P2Kr9rxVmyrb-xCqrZQEC7Q",
  },

  metadataBase: new URL("https://myjobsindia.netlify.app"),

  openGraph: {
    title: "MyJobsIndia - Premium Job Platform",
    description: "Discover the best jobs at top companies.",
    url: "https://myjobsindia.netlify.app",
    siteName: "MyJobsIndia",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "MyJobsIndia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MyJobsIndia - Premium Job Platform",
    description: "Discover the best jobs at top companies.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
        suppressHydrationWarning
      >
        <Navbar />

        <main className="min-h-screen pt-16">
          {children}
        </main>

        <footer className="bg-slate-900 text-slate-300 py-12 mt-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="h-8 mb-6 opacity-70 grayscale hover:grayscale-0 transition-all">
              <img
                src="/logo.svg"
                alt="MyJobsIndia"
                className="h-full w-auto object-contain"
              />
            </div>

            <p>
              &copy; {new Date().getFullYear()} MyJobsIndia.
              All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
