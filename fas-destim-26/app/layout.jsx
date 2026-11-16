import { Press_Start_2P, VT323 } from "next/font/google";
import ThemeInit from "./components/ThemeInit";
import "./globals.css";

// Font pixel untuk judul (Press Start 2P)
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

// Font retro untuk teks biasa (VT323), mudah dibaca
const retroFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata = {
  title: "Festival Anak Sholeh 2026",
  description:
    "Festival Anak Sholeh 2026: Cerdas dan Berakhlaq Mulia",
  metadataBase: new URL("https://festival-anak-sholih-destim.web.app"),
  openGraph: {
    title: "Festival Anak Sholeh 2026",
    description: "Festival Anak Sholeh Desa Timur CERIA 2026 'Cerdas dan Berakhlaq Mulia'. Informasi lomba, pendaftaran, dan dokumentasi.",
    siteName: "Festival Anak Sholeh 2026",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://festival-anak-sholih-destim.web.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Preview Festival Anak Sholeh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Festival Anak Sholeh 2026",
    description: "Festival Anak Sholeh Desa Timur CERIA 2026 'Cerdas dan Berakhlaq Mulia'.",
    images: ["https://festival-anak-sholih-destim.web.app/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/opengraph-icon.png", type: "image/png" },
    ],
    shortcut: "/opengraph-icon.png",
    apple: "/opengraph-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${pixelFont.variable} ${retroFont.variable} scroll-smooth`}
      suppressHydrationWarning
    >
         <body className="font-retro" suppressHydrationWarning>
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
