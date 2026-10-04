import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blindspot-ai.vercel.app";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
            __html: `(function(){try{var t=localStorage.getItem('bsai_theme');var d=t==='dark'||(!t||t==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches:false);if(d){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
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
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
