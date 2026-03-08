import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
	variable: "--font-nunito",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "GlowSafe | Personal UV Guidance for Young Australians",
	description:
		"Personalised UV guidance based on your skin type, location, and plans. Real-time BOM data, no lectures — just clear advice for sun-smart confidence.",
	icons: {
		icon: "https://nec24.com/wp-content/uploads/2021/07/sunshine.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${nunito.variable} ${nunito.className} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
