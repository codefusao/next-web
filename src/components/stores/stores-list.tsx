"use client";

import { Store } from "lucide-react";
import { AddStoreModal } from "@/components/stores/modals/add-store-modal";
import { StoreCard } from "@/components/stores/store-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { paginationPageSize } from "@/constants/pagination";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { filterStores } from "@/lib/filter-stores";
import { useStoresStore } from "@/store/stores-store";

export function StoresList() {
	const stores = useStoresStore((state) => state.stores);
	const {
		activePage,
		goToNextPage,
		goToPreviousPage,
		filteredItems,
		query,
		setSearchQuery,
		totalPages,
		visibleItems: visibleStores,
	} = useSearchPagination({
		items: stores,
		itemsPerPage: paginationPageSize.stores,
		filter: filterStores,
	});

	return (
		<section aria-label="Lista de lojas">
			<div className="mb-4 flex items-start gap-3">
				<SearchInput
					query={query}
					onQueryChange={setSearchQuery}
					placeholder="Buscar por loja ou endereço"
					label="Buscar lojas"
					className="mb-0 flex-1"
				/>
				<AddStoreModal />
			</div>
			{filteredItems.length === 0 ? (
				<EmptyState
					icon={Store}
					title="Nenhuma loja encontrada"
					description="Tente buscar por outro nome ou endereço."
				/>
			) : (
				<>
					<ul className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{visibleStores.map((store) => (
							<li key={store.id} className="h-full">
								<StoreCard store={store} />
							</li>
						))}
					</ul>
					<PaginationControls
						activePage={activePage}
						totalPages={totalPages}
						onPrevious={goToPreviousPage}
						onNext={goToNextPage}
						label="Paginação de lojas"
					/>
				</>
			)}
		</section>
	);
}
