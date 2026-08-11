import { AuthenticatedPage } from "@/components/admin/authenticated-page";

export default function StoreDetailsLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <AuthenticatedPage>{children}</AuthenticatedPage>;
}
