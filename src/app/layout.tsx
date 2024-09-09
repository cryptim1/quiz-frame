import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Are You Smarter Than a 5th Grader?",
  description: "Test your knowledge with this quiz!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
