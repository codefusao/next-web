import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "default" | "compact" | "icon" | "icon-sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline-primary",
	outline:
		"border border-border text-foreground hover:bg-background focus-visible:outline-primary",
	ghost:
		"text-muted hover:bg-card hover:text-foreground focus-visible:outline-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
	default: "h-[var(--control-height-button)] px-6 text-base",
	compact: "h-10 px-3 text-sm",
	icon: "size-10 p-2",
	"icon-sm": "size-7 p-1",
};

export function Button({
	children,
	className = "",
	type = "button",
	variant = "primary",
	size = "default",
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
