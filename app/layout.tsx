//app/layout.tsx
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import GoogleAnalytcs from "./components/GoogleAnalytcs";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plics-SW",
  description: "Sistema ERP completo e totalmente offline",
  applicationName: "Plics-SW",
  keywords:
    "plics, pliqs, plics-sw, erp, erp offline, erp sem internet, controle de estoque, sistema para gerenciar negócio, sistema de computador para pequenos negócios",
  openGraph: {
    type: "website",
    url: "https://plics-sw-webpage.vercel.app",
    title: "Plics-SW Sistema ERP completo para pequenos negócios",
    description: "Sistema ERP completo e totalmente offline",
    siteName: "Plics-SW",
  },
  other: {
    "20d5cea76cf2988525734ffaf18d9626bf8d30e3":
      "20d5cea76cf2988525734ffaf18d9626bf8d30e3",
    referrer: "no-referrer-when-downgrade",
  },
};

//<meta name="20d5cea76cf2988525734ffaf18d9626bf8d30e3" content="20d5cea76cf2988525734ffaf18d9626bf8d30e3" />

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytcs />
        {children}
        <ToastContainer />
        <Script
          src="https://pleased-report.com/bE3/VY0/P.3-ptvybKmNVWJ_ZXD/0k3gMNDkgRxyNWjxQSxMLvTvc/wiOADFEg2VNMD/UC"
          strategy="afterInteractive"
        />
        <footer
          style={{
            width: "100%",
            backgroundColor: "var(--text-main)",
            color: "white",
            padding: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
          }}
        >
          <p>&copy; 2026 PLICS. Todos os direitos reservados.</p>
          {process.env.SUPORTE_CONTATO && (
            <p style={{ marginTop: "0.5rem" }}>
              Suporte:{" "}
              <a
                href={process.env.SUPORTE_CONTATO}
                style={{ color: "var(--accent)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Clique aqui
              </a>
            </p>
          )}
        </footer>
      </body>
    </html>
  );
}
