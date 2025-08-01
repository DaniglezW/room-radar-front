import "./ui/global.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { montserrat } from "./ui/fonts";
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ClientToaster from "./components/ClientToaster";
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata = {
  title: 'Room Radar',
  description: 'Web de reservas de hoteles',
  icons: {
    icon: '/app/favicon.ico',
  },
};

type RootLayoutProps = {
  readonly children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ClientToaster />
          <CurrencyProvider>
            <LanguageProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </LanguageProvider>
          </CurrencyProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
