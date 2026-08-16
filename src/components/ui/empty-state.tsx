import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
	icon?: LucideIcon;
	title: string;
	description: string;
	action?: React.ReactNode;
	className?: string;
	titleAs?: "h1" | "p";
};

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className = "",
	titleAs = "p",
}: EmptyStateProps) {
	const Title = titleAs;

	return (
		<div
			className={`rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-12 text-center ${className}`}
		>
			{Icon ? (
				<Icon aria-hidden="true" className="mx-auto mb-3 size-9 text-muted" />
			) : null}
			<Title className="font-semibold">{title}</Title>
			<p className="mt-1 text-sm text-muted">{description}</p>
			{action ? <div className="mt-6">{action}</div> : null}
		</div>
	);
}
