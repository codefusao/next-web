type ContentCardProps = React.ComponentProps<"section">;

export function ContentCard({ className = "", ...props }: ContentCardProps) {
	return (
		<section
			{...props}
			className={`rounded-[var(--radius-card)] border border-border bg-card ${className}`}
		/>
	);
}
