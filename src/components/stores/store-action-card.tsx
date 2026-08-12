import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type StoreActionCardProps = {
	href: string;
	icon: LucideIcon;
	title: string;
	description: string;
};

export function StoreActionCard({
	href,
	icon: Icon,
	title,
	description,
}: StoreActionCardProps) {
	return (
		<Link
			href={href}
			className="group flex items-start gap-4 rounded-[var(--radius-card)] border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		>
			<span className="inline-flex rounded-[var(--radius-control)] bg-primary/10 p-3 text-primary">
				<Icon aria-hidden="true" className="size-6" />
			</span>
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="flex items-center justify-between gap-3 text-base font-bold text-foreground">
					{title}
					<ArrowUpRight
						aria-hidden="true"
						className="size-5 shrink-0 text-muted transition-colors group-hover:text-primary"
					/>
				</span>
				<span className="mt-1 text-sm leading-6 text-muted">{description}</span>
			</span>
		</Link>
	);
}
