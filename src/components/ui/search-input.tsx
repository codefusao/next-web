import { Search } from "lucide-react";
import { formControlClass } from "@/components/ui/form-field";

type SearchInputVariant = "default" | "form";

type SearchInputProps = {
	query: string;
	onQueryChange: (query: string) => void;
	placeholder: string;
	label: string;
	inputId?: string;
	onBlur?: () => void;
	onFocus?: () => void;
	variant?: SearchInputVariant;
	className?: string;
	inputClassName?: string;
};

export function SearchInput({
	query,
	onQueryChange,
	placeholder,
	label,
	inputId,
	onBlur,
	onFocus,
	variant = "default",
	className = "",
	inputClassName = "",
}: SearchInputProps) {
	return (
		<div className={`relative mb-4 ${className}`}>
			<Search
				aria-hidden="true"
				className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted"
			/>
			<input
				id={inputId}
				type="search"
				value={query}
				onChange={(event) => onQueryChange(event.target.value)}
				placeholder={placeholder}
				onBlur={onBlur}
				onFocus={onFocus}
				className={
					variant === "form"
						? `${formControlClass({ hasError: false })} pl-11 ${inputClassName}`
						: `h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] border-border bg-card py-3 pl-11 pr-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary ${inputClassName}`
				}
				aria-label={label}
			/>
		</div>
	);
}
