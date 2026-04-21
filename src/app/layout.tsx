import type { Metadata } from "next";
import { Google_Sans, Roboto, Roboto_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BwAI · Showcase",
  description:
    "Koleksi karya peserta Build with AI Workshop — dikurasi & dipamerkan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${roboto.variable} ${robotoMono.variable} ${googleSans.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground selection:bg-[color:var(--google-blue)]/20">
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
