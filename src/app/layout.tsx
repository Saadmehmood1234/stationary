import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProvider } from "@/components/providers/ClientProvider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ali Books",
  description:
    "Premium stationery and printing services for students and professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
        <ClientProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900">
            <AuthProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            </AuthProvider>
          </div>
        </ClientProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toasterId="default"
          toastOptions={{
            className: "rounded-lg shadow-lg font-sans",
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: "#1F2937",
              color: "#F9FAFB",
            },
            success: {
              duration: 3000,
              className: "border-l-4 border-l-green-500",
              iconTheme: {
                primary: "#10B981",
                secondary: "#FFFFFF",
              },
              style: {
                background: "#064E3B",
                color: "#ECFDF5",
                border: "1px solid #047857",
              },
            },
            error: {
              duration: 5000,
              className: "border-l-4 border-l-red-500",
              iconTheme: {
                primary: "#EF4444",
                secondary: "#FFFFFF",
              },
              style: {
                background: "#7F1D1D",
                color: "#FEF2F2",
                border: "1px solid #DC2626",
              },
            },
            loading: {
              duration: Infinity,
              className: "border-l-4 border-l-blue-500",
              iconTheme: {
                primary: "#3B82F6",
                secondary: "#FFFFFF",
              },
              style: {
                background: "#1E3A8A",
                color: "#EFF6FF",
                border: "1px solid #2563EB",
              },
            },
            blank: {
              duration: 3000,
              className: "border-l-4 border-l-gray-500",
              iconTheme: {
                primary: "#6B7280",
                secondary: "#FFFFFF",
              },
              style: {
                background: "#374151",
                color: "#F9FAFB",
              },
            },
            custom: {
              duration: 4000,
              className: "border-l-4 border-l-purple-500",
              iconTheme: {
                primary: "#8B5CF6",
                secondary: "#FFFFFF",
              },
              style: {
                background: "#4C1D95",
                color: "#FAF5FF",
                border: "1px solid #7C3AED",
              },
            },
          }}
        />
        </ThemeProvider>
      </body>
    </html>
  );
}
