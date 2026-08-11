import type { ReactNode } from "react";

export function inputBorderClass(hasError: boolean) {
	return hasError ? "border-destructive" : "border-border";
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
