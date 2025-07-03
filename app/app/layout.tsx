import "./ui/global.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { montserrat } from "./ui/fonts";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ClientToaster from "./components/ClientToaster";

export const metadata = {
  title: 'Room Radar',
  description: 'Web de reservas de hoteles',
  icons: {
    icon: './app/app/public/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

type RootLayoutProps = {
  readonly children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <ClientToaster />
        <CurrencyProvider>
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
