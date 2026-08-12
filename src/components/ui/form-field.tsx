import type { ReactNode } from "react";

export function inputBorderClass(hasError: boolean) {
	return hasError ? "border-destructive" : "border-border";
}

type FormControlKind = "text" | "textarea" | "file";

const formControlClasses: Record<FormControlKind, string> = {
	text: "h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary",
	textarea:
		"min-h-28 w-full resize-y rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary",
	file: "w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 py-3 text-[15px] text-foreground outline-none transition-colors file:mr-3 file:cursor-pointer file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-primary focus:border-primary",
};

export function formControlClass({
	kind = "text",
	hasError,
}: {
	kind?: FormControlKind;
	hasError: boolean;
}) {
	return `${formControlClasses[kind]} ${inputBorderClass(hasError)}`;
}

type FormFieldProps = {
	label: string;
	inputId: string;
	error?: string;
	errorId?: string;
	hint?: string;
	children: ReactNode;
};

export function FormField({
	label,
	inputId,
	error,
	errorId,
	hint,
	children,
}: FormFieldProps) {
	return (
		<div>
			<label
				className="mb-1.5 block text-sm font-semibold text-foreground"
				htmlFor={inputId}
			>
				{label}
			</label>
			{children}
			{error ? (
				<span id={errorId} className="mt-1 block text-xs text-destructive">
					{error}
				</span>
			) : hint ? (
				<span className="mt-1 block text-xs text-muted">{hint}</span>
			) : null}
		</div>
	);
}
