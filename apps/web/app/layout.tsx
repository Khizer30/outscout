import Navbar from "@shared/components/layout/Navbar";
import { cn } from "@shared/lib/utils";
import AuthProvider from "@shared/providers/AuthProvider";
import I18nProvider from "@shared/providers/I18nProvider";
import QueryProvider from "@shared/providers/QueryClientProvider";
import ThemeProvider from "@shared/providers/ThemeProvider";
import type { Children } from "@shared/types/children.types";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "@fontsource-variable/roboto/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "OutScout",
  description:
    "OutScout is a geo-targeted B2B lead generation and outreach platform built for freelancers, agencies, and sales teams who need to find, qualify, and contact local businesses fast. It is designed specifically for markets where WhatsApp is the dominant communication channel (Pakistan, Gulf countries, and similar regions)."
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", "font-sans")}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <QueryProvider>
              <AuthProvider>
                <Navbar />
                {children}
                <Toaster position="top-center" />
              </AuthProvider>
            </QueryProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
