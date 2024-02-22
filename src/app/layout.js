import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import {
  Inter,
  Montserrat,
  Poppins,
  Roboto,
  Metrophobic,
  Cinzel,
} from "next/font/google";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import GymGirl from "../../public/gym-girl.jpg";
import styles from "./page.module.css";
import AuthProvider from "@/components/auth-provider/AuthProvider";
import Head from "next/head";

import { ExerciseProvider } from "@/context/ExerciseContext";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "200" });
const roboto = Roboto({ subsets: ["latin"], weight: "100" });
const metrophobic = Metrophobic({ subsets: ["latin"], weight: "400" });
const cinzel = Cinzel({ subsets: ["latin"], weight: "400" });

export const metadata = {
  manifest: "./manifest.json",
  title: "AniFit",
  description: "Personal fitness coach AniFit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <Head>
        <link rel="shortcut icon" href="./favicon.ico" />
      </Head>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <ExerciseProvider>
          <div className="container">
            <AuthProvider>
              <Navbar />
              {children}
              <Footer />
            </AuthProvider>
          </div>
        </ExerciseProvider>
      </body>
    </html>
  );
}

// <meta
// name='viewport'
// content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
// />
