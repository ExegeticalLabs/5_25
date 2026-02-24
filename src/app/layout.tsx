import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileLayout } from "@/components/MobileLayout";

export const metadata: Metadata = {
  title: "Fitness PWA",
  description: "Mobile-first fitness progressive web app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#008080",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <MobileLayout>{children}</MobileLayout>
      </body>
    </html>
  );
}
