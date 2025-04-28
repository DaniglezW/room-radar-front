import "./ui/global.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { montserrat } from "./ui/fonts";
import { LanguageProvider } from "@/context/LanguageContext";

type RootLayoutProps = {
  readonly children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
