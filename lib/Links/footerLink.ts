export type LinkItem = {
  href: string;
  label: string;
  external?: boolean;
};

export type footerT = {
  title: string;
  links: LinkItem[];
};

export const footerSections: footerT[] = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Teas" },
      { href: "/products?category=hormonal", label: "Hormonal Balance" },
      { href: "/products?category=energy", label: "Energy Boost" },
      { href: "/products?category=sleep", label: "Sleep Support" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "#about", label: "Our Story" },
      { href: "#journey", label: "Farm Partners" },
      { href: "#blog", label: "Wellness Blog" },
      { href: "/rituals", label: "Tea Rituals" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "https://instagram.com", label: "Instagram", external: true },
      { href: "https://facebook.com", label: "Facebook", external: true },
      { href: "https://youtube.com", label: "YouTube", external: true },
      { href: "https://tiktok.com", label: "TikTok", external: true },
    ],
  },
];
