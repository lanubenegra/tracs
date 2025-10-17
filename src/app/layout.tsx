import './globals.css';

export const metadata = {
  title: 'TRACS Preview',
  description: 'TRACS website preview',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
