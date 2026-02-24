import "./globals.css";
import Header from "./_components/Header";

export const metadata = {
  title: "Spendly — AI Expense Tracker",
  description: "Track expenses with AI-powered insights",
  viewport: "width=device-width, initial-scale=1",
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