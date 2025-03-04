import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "EPL Soccer Tours - Professional Player & Coach Experience",
  description:
    "Experience authentic English football culture through immersive training programs with Premier League academies. Train with professional players, gain coaching qualifications, and immerse yourself in Manchester's soccer culture.",
  openGraph: {
    title: "EPL Soccer Tours - Professional Player & Coach Experience",
    description:
      "Experience authentic English football culture through immersive training programs with Premier League academies. Train with professional players, gain coaching qualifications, and immerse yourself in Manchester's soccer culture.",
    url: "https://eplsoccertours.org",
    siteName: "EPL Soccer Tours",
    images: [
      {
        url: "https://eplsoccertours.org/logo.png",
        width: 1200,
        height: 630,
        alt: "EPL Soccer Tours - Professional Training Experience",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EPL Soccer Tours - Professional Player & Coach Experience",
    description:
      "Experience authentic English football culture through immersive training programs with Premier League academies. Train with professional players, gain coaching qualifications, and immerse yourself in Manchester's soccer culture.",
    images: ["https://eplsoccertours.org/logo.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased min-h-screen relative`}
      >
        <div
          className="fixed inset-0 w-full h-full bg-no-repeat bg-center opacity-[0.05] pointer-events-none z-0"
          style={{
            backgroundImage: 'url("/logo.png")',
            backgroundSize: "100%",
            transform: "scale(1.00)",
          }}
        />
        <div className="relative z-10">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
