import AskAI from "@/components/AskAI";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { PageTransitionProvider, TransitionType } from "@/components/PageTransitionProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiziBomba - Film ve Dizi İzleme Platformu",
  description: "En yeni film ve dizileri HD kalitede izleyebileceğiniz dijital platform",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden min-h-screen flex flex-col`}
      >
        <PageTransitionProvider
          initialTransitionType={TransitionType.SLIDE}
          initialTransitionDuration={400}
          showLoadingSpinner={true}
        >
          <Header />
          <main className="flex-grow">
            <PageTransition className="w-full">
              {children}
            </PageTransition>
          </main>
          <Footer />
          <AskAI />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
