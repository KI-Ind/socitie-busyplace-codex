// @ts-nocheck
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer as LayoutFooter } from "@/components/layout/footer";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Optimize font loading
});

export const metadata: Metadata = {
  metadataBase: new URL('https://societe.busyplace.fr'),
  title: {
    default: "SocieteBusyplace - Annuaire des entreprises françaises",
    template: "%s | SocieteBusyplace"
  },
  description: "Trouvez des informations détaillées sur les entreprises françaises, leurs dirigeants et suivez leurs actualités. Accédez gratuitement aux données financières et légales.",
  keywords: [
    "entreprises françaises",
    "annuaire entreprises",
    "surveillance entreprise",
    "SIRET",
    "SIREN",
    "données légales",
    "informations financières",
    "dirigeants entreprise"
  ],
  authors: [{ name: "SocieteBusyplace" }],
  creator: "SocieteBusyplace",
  publisher: "SocieteBusyplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/favicon.ico',
    other: {
      rel: 'icon',
      url: '/images/favicon.ico',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://societe.busyplace.fr',
    siteName: 'SocieteBusyplace',
    title: 'SocieteBusyplace - Annuaire des entreprises françaises',
    description: 'Trouvez des informations détaillées sur les entreprises françaises, leurs dirigeants et suivez leurs actualités. Accédez gratuitement aux données financières et légales.',
    images: [
      {
        url: '/images/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'SocieteBusyplace - Annuaire des entreprises françaises',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocieteBusyplace - Annuaire des entreprises françaises',
    description: 'Trouvez des informations détaillées sur les entreprises françaises, leurs dirigeants et suivez leurs actualités.',
    images: ['/images/og-image.jpg'], // Same image as OpenGraph
    creator: '@societebusyplace',
    site: '@societebusyplace',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://societe.busyplace.fr',
    languages: {
      'fr-FR': 'https://societe.busyplace.fr',
    },
  },
  verification: {
    google: 'your-google-site-verification', // Add your Google verification code
  },
  manifest: '/manifest.json',
  themeColor: '#1CBE93',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <JsonLd />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <LayoutFooter />
      </body>
    </html>
  );
}
