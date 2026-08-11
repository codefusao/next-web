import { SearchInput } from "@/components/ui/search-input";

type StoresSearchProps = {
	query: string;
	onQueryChange: (query: string) => void;
};

export function StoresSearch({ query, onQueryChange }: StoresSearchProps) {
	return (
		<SearchInput
			query={query}
			onQueryChange={onQueryChange}
			placeholder="Buscar por loja ou endereço"
			label="Buscar lojas"
		/>
	);
}
