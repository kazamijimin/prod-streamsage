
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Switcher from "@/components/Switcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StreamSage",
  description: "StreamSage - Stream Smarter, Debug Faster, Learn Better.",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Switcher />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
