import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solvik Studio - Crea tu Landing Page en 5 minutos',
  description: 'Plataforma SaaS para crear landing pages ultra simples sin código. Ideal para pequeños negocios.',
  keywords: 'landing page, sin código, pequeños negocios, sitio web, solvik studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}