import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./Context/ThemeContext";

export const metadata: Metadata = {
  title: "Klex-Logistics",
  description: "Logistics and delivery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
