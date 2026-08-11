"use client";

import { Boxes, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthenticatedPage } from "@/components/admin/authenticated-page";

const tabs = [
	{ href: "/products", label: "Produtos", icon: Boxes },
	{ href: "/stores", label: "Lojas", icon: Store },
] as const;

export default function TabsLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();

	return (
		<AuthenticatedPage>
			<nav
				aria-label="Áreas administrativas"
				className="border-b border-border bg-card"
			>
				<div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 sm:px-6">
					{tabs.map(({ href, label, icon: Icon }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={href}
								href={href}
								aria-current={active ? "page" : undefined}
								className={`inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${active ? "border-primary text-primary" : "border-transparent text-muted hover:border-border hover:text-foreground"}`}
							>
								<Icon aria-hidden="true" className="size-4" />
								{label}
							</Link>
						);
					})}
				</div>
			</nav>

			<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
				{children}
			</div>
		</AuthenticatedPage>
	);
}
