import type { Metadata } from "next";
import { jakarta, neirizi, cormorant, montserrat } from "./pages/fonts";
import { Suspense } from "react";
import { ThemeProvider } from "./pages/components/ThemeProvider";
import { NavBar } from "./pages/components/NavBar";
import { Footer } from "./pages/components/Footer";
import { SearchModal } from "./pages/components/SearchModal";
import { AIModal } from "./pages/components/AIModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hadits Berdasarkan Tema Kehidupan",
  description: "Temukan petunjuk Rasulullah ﷺ berdasarkan tema kehidupan sehari-hari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${jakarta.variable} ${neirizi.variable} ${cormorant.variable} ${montserrat.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('my-islam-theme');
                  if (!t) { t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
                  document.documentElement.classList.toggle('dark', t === 'dark');
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" cz-shortcut-listen="true">
        <ThemeProvider>
          <NavBar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Suspense fallback={null}>
            <SearchModal />
          </Suspense>
          <AIModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
