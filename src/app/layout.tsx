import type { Metadata, Viewport } from "next";
import { Archivo, Barlow_Condensed, Inter } from "next/font/google";
import { Cursor } from "@/components/interaction/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { JsonLd } from "@/components/seo/JsonLd";
import { seo } from "@/config/seo";
import { site } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  // headings/nav: not needed for the first paint of the hero (keeps bandwidth for the LCP image)
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.titleDefault, template: seo.titleTemplate },
  description: seo.description,
  keywords: seo.keywords,
  applicationName: site.name,
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: seo.twitterCard },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#151C22",
  colorScheme: "light",
};

/** Runs before first paint: enables the intro-animation gate only when motion is allowed. */
const motionGate = `(function(){var d=document.documentElement;d.classList.add('js');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('anim');setTimeout(function(){if(!d.classList.contains('anim-ready'))d.classList.add('anim-fallback')},3500)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.language}
      className={`${barlow.variable} ${archivo.variable} ${inter.variable}`}
      // the motion gate script adds classes to <html> before hydration
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      </head>
      <body className="bg-slate-deep pb-[calc(3.875rem+env(safe-area-inset-bottom))] lg:pb-0">
        <a
          href="#main"
          className="lettering fixed left-4 top-4 z-[100] -translate-y-[200%] bg-amber px-4 py-3 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionRoot>
          <Header />
          <div className="relative z-10 bg-paper" data-page-surface>
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </div>
          <Footer />
          <MobileActionBar />
          <Cursor />
        </MotionRoot>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
