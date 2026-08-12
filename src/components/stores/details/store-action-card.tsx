import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type StoreActionCardProps = {
	href?: string;
	icon: LucideIcon;
	title: string;
	description: string;
	disabled?: boolean;
};

export function StoreActionCard({
	href,
	icon: Icon,
	title,
	description,
	disabled = false,
}: StoreActionCardProps) {
	const content = (
		<>
			<span className="inline-flex rounded-[var(--radius-control)] bg-primary/10 p-2.5 text-primary">
				<Icon aria-hidden="true" className="size-5" />
			</span>
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="flex items-center justify-between gap-2 text-sm font-bold text-foreground">
					{title}
					<ArrowUpRight
						aria-hidden="true"
						className="size-4 shrink-0 text-muted transition-colors group-hover:text-primary"
					/>
				</span>
				<span className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
					{description}
				</span>
			</span>
		</>
	);

	const className = `group flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-background p-4 ${
		disabled
			? "cursor-not-allowed opacity-55"
			: "transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
	}`;

	if (!href || disabled) {
		return (
			<div aria-disabled="true" className={className}>
				{content}
			</div>
		);
	}

	return (
		<Link href={href} className={className}>
			{content}
		</Link>
	);
}
