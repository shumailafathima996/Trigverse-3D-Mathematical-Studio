import './globals.css';

export const metadata = {
  title: 'TrigVerse01 — Holographic Trigonometry Lab',
  description: 'AI-powered interactive trigonometry studio with 3D unit circle visualization',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
