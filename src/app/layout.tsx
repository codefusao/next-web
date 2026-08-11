import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entrar | Leroy Merlin",
  description: "Entre na sua conta Leroy Merlin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
