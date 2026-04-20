import './global.css';

export const metadata = {
  title: 'Metro',
  description: 'Metro — motorcycle accessories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
