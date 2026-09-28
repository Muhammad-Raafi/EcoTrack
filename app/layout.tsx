import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pengelolaan Sampah',
  description: 'Aplikasi Pengelolaan Sampah',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}