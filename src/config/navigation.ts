export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta: NavItem = { label: "Request a site visit", href: "/contact#enquiry" };

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Services", href: "/services" },
      { label: "Sump & OHT", href: "/services/sump-oht-construction" },
      { label: "Interiors & fit-outs", href: "/services/interiors-fit-outs" },
    ],
  },
];

export const legalNav: NavItem[] = [{ label: "Privacy", href: "/privacy" }];
