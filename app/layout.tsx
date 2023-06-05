import "./globals.css";
import { Lexend } from "next/font/google";
import ToasterProvider from "./providers/ToasterProvider";
import { ThemeProvider } from "@mui/material";

const font = Lexend({
	subsets: ["latin"],
});

export const metadata = {
	title: "Bølger og skvulp",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={font.className}>
				{children}
				<ToasterProvider />
			</body>
		</html>
	);
}
