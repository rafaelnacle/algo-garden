import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Algo Atlas — C++ in motion',
  description: 'An interactive C++ algorithm lab. Explore sorting, searching, graphs, and data structures with animated traces, explained code, and practice questions.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}
