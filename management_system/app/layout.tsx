import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Layout } from "antd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const { Content } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ width: "100vw", height: "100vh", padding: "1rem" }}
      >
        <div className="flex w-full h-full">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Layout */}
          <main className="flex-1 p-6">
            <Breadcrumbs />
            {/* Content */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
