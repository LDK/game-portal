import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import "./typography.css";
import dynamic from "next/dynamic";

const StoreProvider = dynamic(() => import("@/app/redux/StoreProvider"), {
  ssr: false
});

export const metadata: Metadata = {
  title: "App",
  description: "App Desription",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Della+Respira&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet" />
      </head>

      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
