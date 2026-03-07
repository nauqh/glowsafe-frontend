import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "GlowSafe | Personal UV Guidance for Young Australians",
	description:
		"Personalised UV guidance based on your skin type, location, and plans. Real-time BOM data, no lectures — just clear advice for sun-smart confidence.",
	icons: {
		icon: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
