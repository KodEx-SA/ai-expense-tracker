import "./globals.css";
import Header from "./_components/Header";

export const metadata = {
  title: "AI Expense Tracker",
  description: "Track expenses with AI-powered insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flex: 1, paddingBottom: "3rem" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}