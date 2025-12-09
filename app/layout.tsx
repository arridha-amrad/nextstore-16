import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { env } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nextstore",
  description: "Nextstore by devari",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <script
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={env.midtransPublicClientKey}
        ></script>
      </head> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <div id="snap-container"></div> */}
        <NextTopLoader showSpinner={false} color="#fdc700" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
