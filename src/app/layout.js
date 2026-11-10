import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthContext";
import CartDrawer from "../components/layout/CartDrawer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Shoe King — Premium Footwear",
  description:
    "Discover the finest collection of premium footwear at Shoe King. Shop the latest sneakers, boots, and luxury shoes for men and women.",
  keywords: "shoes, sneakers, boots, luxury footwear, shoe king",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Identity Services — loads the google.accounts.id API */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${outfit.variable} ${inter.variable}`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <CartDrawer />
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
