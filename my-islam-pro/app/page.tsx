import type { Metadata } from "next";
import HomePage from "./pages/homepage";

export const metadata: Metadata = {
  title: "Hadis Berdasarkan Tema Kehidupan",
  description:
    "Temukan petunjuk Rasulullah ﷺ berdasarkan tema kehidupan sehari-hari — tersusun sistematis, mudah dipahami dan diamalkan.",
  openGraph: {
  title: "Hadits Berdasarkan Tema Kehidupan",
    description: "Koleksi hadits pilihan berdasarkan tema kehidupan.",
    type: "website",
  },
};

export default async function Home() {
  return <HomePage />;
}
