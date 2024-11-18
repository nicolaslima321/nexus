import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "~/layouts/header/Header";

/* This provider is only used to avoid hydratation and compatibility errors with nextjs
 * ref: https://mui.com/material-ui/integrations/nextjs/#app-router
 */
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SurvivorAuthProvider } from "~/contexts/SurvivorContext";
import Toast from "~/components/common/Toast";
import { NotificationProvider } from "~/contexts/NotificationContext";
import { AppProvider } from "~/contexts/AppContext";
import Template from "./template";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nexus Survival",
  description: "The app to assist in your survival!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <SurvivorAuthProvider>
            <NotificationProvider>
              <AppRouterCacheProvider>
                <Header/>
                <Toast />

                <div className="px-4 py-4 md:py-8 md:px-32 w-full h-full">
                  <Template>
                    {children}
                  </Template>
                </div>
              </AppRouterCacheProvider>
            </NotificationProvider>
          </SurvivorAuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
