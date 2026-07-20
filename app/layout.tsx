//app/layout.tsx
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';

import type { Metadata } from 'next';
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';
import GoogleAnalytcs from './components/GoogleAnalytcs';
import Header from './components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Plics-SW',
  description:
    'Plics SW é um sistema de gestão ERP completo fácil de usar e offline voltado para pequenos e médios negócios. Dá pra imprimir notinhas não fiscais, realizar cadastros de produtos, clientes, fornecedores. Registrar vendas. Cadastrar ordem de serviço (OS). Você pode categorizar seus produtos. O Plics SW substitui planilhas excel completamente. Seus dados são protegidos. Seus dados ficam salvos mesmo que você desinstale o aplicativo.',
  applicationName: 'Plics-SW',
  keywords:
    'plics, pliqs, plics-sw, erp, erp offline, erp sem internet, controle de estoque, sistema para gerenciar negócio, sistema de computador para pequenos negócios',
  pinterest: {
    richPin: true,
  },
  category: 'ERP',
  twitter: {
    site: '@plicssw',
    creator: '@plicssw',
  },

  openGraph: {
    type: 'website',
    url: 'https://plics-sw-webpage.vercel.app',
    title:
      'Plics SW é um sistema de gestão ERP completo fácil de usar e offline voltado para pequenos e médios negócios. Dá pra imprimir notinhas não fiscais, realizar cadastros de produtos, clientes, fornecedores. Registrar vendas. Cadastrar ordem de serviço (OS). Você pode categorizar seus produtos. O Plics SW substitui planilhas excel completamente. Seus dados são protegidos. Seus dados ficam salvos mesmo que você desinstale o aplicativo.',
    description: 'Sistema ERP completo e totalmente offline',
    siteName: 'Plics-SW',
    images: 'https://i.ibb.co/b5vGtBnB/logo-256x256.png',
  },
  other: {
    '20d5cea76cf2988525734ffaf18d9626bf8d30e3':
      '20d5cea76cf2988525734ffaf18d9626bf8d30e3',
    referrer: 'no-referrer-when-downgrade',
  },
};

//<meta name="20d5cea76cf2988525734ffaf18d9626bf8d30e3" content="20d5cea76cf2988525734ffaf18d9626bf8d30e3" />

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <GoogleAnalytcs />
        {children}
        <ToastContainer />
        <Script
          src='https://pleased-report.com/bi3GVx0/P.3zp/vOb/mLVWJdZVD/0_3kMvD/gSx-NgjogMxnLATuccwvOMDQE/2aOlDbUl'
          strategy='afterInteractive'
        />
        <footer
          style={{
            width: '100%',
            backgroundColor: 'var(--text-main)',
            color: 'white',
            padding: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
          }}
        >
          <p>&copy; 2026 PLICS. Todos os direitos reservados.</p>
          {process.env.SUPORTE_CONTATO && (
            <p style={{ marginTop: '0.5rem' }}>
              Suporte:{' '}
              <a
                href={process.env.SUPORTE_CONTATO}
                style={{ color: 'var(--accent)' }}
                target='_blank'
                rel='noopener noreferrer'
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
