//Root Layout
import type { Metadata } from "next";
import "@/styles/globals.css";
import { Noto_Serif, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.idria.com"),
  title: "Idria: D&D Roleplay",
  description: 'Idria is a Forgotten Realms based D&D roleplay server built within Conan Exiles.',
  keywords: ['next.js', 'react'],
  openGraph: {
    title: 'Idria: D&D Roleplay',
    description: 'Idria is a Forgotten Realms based D&D roleplay server built within Conan Exiles.',
    images: ['/public/IdriaLogoSimple.png'],
  },
  icons: {
    icon: "./IdriaLogoSimple.png", 
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.idria.com',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", notoSerif.variable, playfairDisplayHeading.variable)}>
      <body>
        <Analytics />
        <SpeedInsights/>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
