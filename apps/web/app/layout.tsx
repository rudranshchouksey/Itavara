import '@itvara/ui/styles.css';
import React from 'react';
import { UniversalFooter, SubBottomFooter, ThemeProvider } from '@itvara/ui';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'DARK' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <main className="flex-grow">
            {children}
          </main>
          <UniversalFooter />
          <SubBottomFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
