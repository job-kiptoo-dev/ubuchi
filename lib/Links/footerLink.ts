export type LinkItem = {
	href: string
	label: string
	external?: boolean
}

export type footerT = {
	title: string
	links: LinkItem[]
}

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
		title: "Connect",
		links: [
			{ href: " https://www.instagram.com/ubuchitea ", label: "Instagram", external: true },
			// { href: "https://facebook.com", label: "Facebook", external: true },
			// { href: "https://youtube.com", label: "YouTube", external: true },
			// { href: "https://tiktok.com", label: "TikTok", external: true },
		],
	},
	{
		title: "Contact",
		links: [
			{ href: "mailto:ubuchitea@gmail.com", label: "ubuchitea@gmail.com", external: true },
			{ href: "#", label: "CVR: 46050746" },
		],
	},
]

