import { useState } from "react";

export function usePagination<T>(items: readonly T[], itemsPerPage: number) {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
	const activePage = Math.min(currentPage, totalPages);
	const visibleItems = items.slice(
		(activePage - 1) * itemsPerPage,
		activePage * itemsPerPage,
	);

	function goToPreviousPage() {
		setCurrentPage(Math.max(1, activePage - 1));
	}

	function goToNextPage() {
		setCurrentPage(Math.min(totalPages, activePage + 1));
	}

	function resetPage() {
		setCurrentPage(1);
	}

	return {
		activePage,
		goToNextPage,
		goToPreviousPage,
		resetPage,
		totalPages,
		visibleItems,
	};
}
