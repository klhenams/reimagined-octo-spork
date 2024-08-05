import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: '%s | MenuGenius',
    default: 'MenuGenius',
  },
  description: 'The Official Website For The Association Of Computer Engineering Students, Kwame Nkrumah University of Science and Technology.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
