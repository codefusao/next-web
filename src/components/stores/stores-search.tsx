import { Search } from "lucide-react";

type StoresSearchProps = {
	query: string;
	onQueryChange: (query: string) => void;
};

export function StoresSearch({ query, onQueryChange }: StoresSearchProps) {
	return (
		<div className="relative mb-4">
			<Search
				aria-hidden="true"
				className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted"
			/>
			<input
				type="search"
				value={query}
				onChange={(event) => onQueryChange(event.target.value)}
				placeholder="Buscar por loja ou endereço"
				className="h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] border-border bg-card py-3 pl-11 pr-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary"
				aria-label="Buscar lojas"
			/>
		</div>
	);
}
