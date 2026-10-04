import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { getMetadataBase, getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "BlindSpot AI | Think beyond what you can see",
    template: "%s | BlindSpot AI",
  },
  description:
    "BlindSpot AI is a reflective thinking tool that helps people examine their reasoning about a decision, without making the decision for you.",
  keywords: [
    "blind spot analysis",
    "decision making",
    "critical thinking",
    "cognitive bias",
    "assumption testing",
    "reflective AI",
    "reasoning partner",
  ],
  authors: [{ name: "BlindSpot AI Engineering Team" }],
  creator: "BlindSpot AI",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "BlindSpot AI | Think beyond what you can see",
    description:
      "Find blind spots in your decision-making. Examine hidden assumptions and explore better questions without any AI recommendation.",
    siteName: "BlindSpot AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlindSpot AI | Think beyond what you can see",
    description:
      "Find blind spots in your decision-making without AI recommendations. Uncover assumptions and explore high-leverage questions.",
    creator: "@BlindSpotAI",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('bsai_theme')||'system';var isDark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var root=document.documentElement;if(isDark){root.classList.add('dark');root.classList.remove('light');root.setAttribute('data-theme','dark');}else{root.classList.remove('dark');root.classList.add('light');root.setAttribute('data-theme','light');}}catch(e){}})()`,
          }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('consent', 'default', {
                  'analytics_storage': 'denied'
                });
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-indigo-600 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium text-sm transition-all"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
