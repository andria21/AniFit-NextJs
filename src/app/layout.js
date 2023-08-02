import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter, Montserrat, Poppins, Roboto } from "next/font/google";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import GymGirl from "../../public/gym-girl.jpg";
import styles from "./page.module.css";
import AuthProvider from "@/components/auth-provider/AuthProvider";

import { ExerciseProvider } from "@/context/ExerciseContext";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "200" });
const roboto = Roboto({ subsets: ["latin"], weight: "100" });

export const metadata = {
  title: "AniFit",
  description: "Personal fitness coach AniFit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className={poppins.className}>
        <ExerciseProvider>
          <div className="container">
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </div>
        </ExerciseProvider>
      </body>
    </html>
  );
}
