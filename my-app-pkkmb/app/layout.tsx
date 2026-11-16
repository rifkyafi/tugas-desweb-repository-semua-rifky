import type { Metadata, Viewport } from "next";
import "./globals.css";
import AudioManager from "../components/audio/AudioManager";
import PixelHeader from "../components/ui/PixelHeader";

export const metadata: Metadata = {
  title: "ARCADE RACE - MABA QUEST 2026",
  description: "Arcade race game for 25 PKKMB members",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <AudioManager>
          <div className="pixel-scanline" />
          <div className="pixel-layout min-h-screen flex flex-col">
            <PixelHeader />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <footer className="pixel-footer">
              <div className="footer-ground" />
              <div className="footer-body">
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', letterSpacing: '1px' }}>
                  &copy; 2026 PKKMB Amaryllis-7 &middot; MABA QUEST
                </p>
              </div>
            </footer>
          </div>
        </AudioManager>
      </body>
    </html>
  );
}
