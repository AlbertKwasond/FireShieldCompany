import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Fire Shield Company Limited | Engineering & Electronic Security",
  description: "Protecting Assets, Securing Futures Since 2003. Premier 100% Ghanaian-owned engineering company specializing in fire safety, electronic security, electrical systems, and mission-critical infrastructure.",
  keywords: "Fire Safety Ghana, CCTV Installation Ghana, Access Control Systems Ghana, Data Center Setup Ghana, Fire Suppression Systems Ghana, Electronic Security Ghana, Engineering Company Ghana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
