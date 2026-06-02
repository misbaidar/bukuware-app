import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthContext";

const arimo = Arimo({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arimo"
});

export const metadata: Metadata = {
  title: "BukuWare - Komunitas Bedah Buku Teknologi",
  description: "Ruang kolaboratif yang menjembatani literatur teknologi dan implementasi nyata di lapangan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      {/* min-w-[1024px] memastikan tampilan tetap mode desktop meskipun dibuka di HP */}
      <body className={`${arimo.variable} font-sans antialiased selection:bg-bwDark selection:text-bwLight min-w-[1024px]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}