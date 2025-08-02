import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";
import QueryProvider from "@/lib/providers/QueryProvider";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A task management app with IndexedDB and React Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${josefinSans.className} antialiased`}>
        <QueryProvider>
          <div className="container">
            <Header />
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
