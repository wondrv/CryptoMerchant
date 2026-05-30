import type { Metadata } from 'next';
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-ibm-plex-sans' });

export const metadata: Metadata = {
  title: 'CryptoMerchant',
  description: 'Crypto payment gateway for merchants with blockchain monitoring and realtime invoice updates.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
      <body className="font-[var(--font-ibm-plex-sans)] text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
