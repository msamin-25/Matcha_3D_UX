import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iced Matcha Espresso Latte",
  description: "A premium scrollytelling experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
