// metadata.ts

import type { UrlObject } from 'url';

// Define the parts of the metadata that have static types.
interface Author {
  name: string;
  url?: string;
}
interface Icons {
  icon: string;
  shortcut: string;
  apple: string;
}
interface OpenGraph {
  images: string;
}
interface FormatDetection {
  email: boolean;
  address: boolean;
  telephone: boolean;
}

interface ExtendedMetadata {
  title: string;
  description: string;
  icons: Icons;
  openGraph: OpenGraph;
  generator: string;
  applicationName: string;
  referrer: string;
  keywords: string[];
  authors: Author[];
  creator: string;
  publisher: string;
  formatDetection: FormatDetection;
  metadataBase: URL | UrlObject; // Note: Using URL might be more straightforward for your case
}

// Correct the way environment variables are used and string interpolation for default URL
const metadataBase: URL = new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

// Construct the full metadata object
const metadata: ExtendedMetadata = {
  title: 'Next.js AI Chatbot',
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    images: '/og-image.png',
  },
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [
    { name: 'Seb' },
    { name: 'Josh', url: 'https://nextjs.org' }
  ],
  creator: 'Jiachi Liu',
  publisher: 'Sebastian Markbåge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: metadataBase,
};

// Since metadata.ts doesn't seem to be a React component file, you might not need to export a React component here.
// export default function Page() {} // This can be removed unless you have specific use for a React component in this context.

export { metadata };
