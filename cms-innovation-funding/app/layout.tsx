// src/app/layout.tsx
import "../styles/globals.css";

export const metadata = {
  title: "CMS App",
  description: "CRUD with Next.js and Prisma",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
