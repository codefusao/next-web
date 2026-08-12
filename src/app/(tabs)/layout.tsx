import { AuthenticatedPage } from "@/components/admin/authenticated-page";

export default function TabsLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<AuthenticatedPage>
			<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
				{children}
			</div>
		</AuthenticatedPage>
	);
}
