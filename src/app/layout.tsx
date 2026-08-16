import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppToaster } from "@/components/ui/app-toaster";
import "./globals.css";

export const metadata: Metadata = {
	title: "Administração | Leroy Merlin",
	description: "Administração de produtos Leroy Merlin.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full antialiased">
			<body className="min-h-full flex flex-col">
				<QueryProvider>{children}</QueryProvider>
				<AppToaster />
			</body>
		</html>
	);
}
