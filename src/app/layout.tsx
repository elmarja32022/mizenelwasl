import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "الميزان - مِيزَانُ العَدْل والتَّبَادُل",
  description: "منصة التبادل العادل للخدمات والمنتجات - بالعَدل قامت السماوات والأرض، وبالميزان نتبادل",
  keywords: ["الميزان", "تبادل", "خدمات", "منتجات", "عدالة", "مجتمع", "عربي"],
  authors: [{ name: "منصة الميزان" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "الميزان - منصة التبادل العادل",
    description: "منصة رقمية مبتكرة لتبادل الخدمات والمنتجات بالقيمة الحقيقية",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground arabic-text`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
