import { useMemo, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";

type UseSearchPaginationOptions<T> = {
	items: readonly T[];
	itemsPerPage: number;
	filter: (items: readonly T[], query: string) => readonly T[];
};

export function useSearchPagination<T>({
	items,
	itemsPerPage,
	filter,
}: UseSearchPaginationOptions<T>) {
	const [query, setQuery] = useState("");
	const filteredItems = useMemo(
		() => filter(items, query),
		[filter, items, query],
	);
	const pagination = usePagination(filteredItems, itemsPerPage);

	function setSearchQuery(nextQuery: string) {
		setQuery(nextQuery);
		pagination.resetPage();
	}

	return { ...pagination, filteredItems, query, setSearchQuery };
}
