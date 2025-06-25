import { Outfit } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/utils/Chatbot";
import { Toaster } from "sonner";
import { AuthContextProvider } from "@/contexts/AuthContext";
const font = Outfit({ subsets: ["latin"], });

export const metadata = {
  title: "Logistics",
  description: "Logistics Software",
};

export default function MainRootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
        <ChatBot />
        <Toaster richColors={true} closeButton={true} expand={true} position="top-right" />
      </body>
    </html>
  );
}
