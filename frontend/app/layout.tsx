'use client';

import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "@/components/nav";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Provider  from "@/providers/WagmiProvider";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors">
        <div className="relative text-primary-black min-h-screen">
          <Head>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>
          <main className="container lg:max-w-6xl py-10 mx-auto">
            <NavBar />
            <div>
              {children}
              <Analytics />
            </div>
          </main>
            </Provider>
          </ThemeProvider>
        </div>
        <div className="-z-10 w-full h-[70vh] absolute top-0 left-0 bg-dark-pattern bg-no-repeat bg-cover lg:bg-[length:100%_100%]"></div>
      </body>
    </html>
  );
};

export default Layout;
