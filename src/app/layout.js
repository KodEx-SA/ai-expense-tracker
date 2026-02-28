import "./globals.css";
import Header from "./_components/Header";

export const metadata = {
  title: "Spendly — AI Expense Tracker",
  description: "Track your expenses intelligently with AI-powered insights, smart categorization, and real-time budget tracking.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
