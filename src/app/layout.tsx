// admin-panel/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Noto_Serif_Devanagari } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Hayagriva Portal | Sovereign Legal AI Chamber & Control Plane',
  description: 'Sovereign AI Suite, Decentralized Legal Chamber & Licensing Control Plane for Advocates and Insolvency Professionals',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${notoSerifDevanagari.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-slate-900 selection:text-white dark:selection:bg-slate-100 dark:selection:text-slate-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
