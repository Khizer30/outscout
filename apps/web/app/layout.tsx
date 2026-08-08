import Navbar from "@shared/components/layout/Navbar";
import { cn } from "@shared/lib/utils";
import I18nProvider from "@shared/providers/I18nProvider";
import QueryProvider from "@shared/providers/QueryClientProvider";
import ThemeProvider from "@shared/providers/ThemeProvider";
import type { Children } from "@shared/types/children.types";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "@fontsource-variable/roboto/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "",
  description: ""
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", "font-sans")}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <QueryProvider>
              <Navbar />
              {children}
              <Toaster position="top-center" />
            </QueryProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
