import { Inter } from "next/font/google";
import { useDispatch } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Transfer",
  description: "ASA Transfer",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
