"use client";

import { ChevronRight, Store } from "lucide-react";
import { useState } from "react";
import { AddStoreModal } from "@/components/stores/add-store-modal";
import { StoreCard } from "@/components/stores/store-card";
import { StoresSearch } from "@/components/stores/stores-search";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { filterStores } from "@/lib/filter-stores";
import { useStoresStore } from "@/store/stores-store";

const storesPerPage = 9;

export function StoresList() {
	const stores = useStoresStore((state) => state.stores);
	const [query, setQuery] = useState("");
	const filteredStores = filterStores(stores, query);
	const {
		activePage,
		goToNextPage,
		goToPreviousPage,
		resetPage,
		totalPages,
		visibleItems: visibleStores,
	} = usePagination(filteredStores, storesPerPage);

	function handleSearch(query: string) {
		setQuery(query);
		resetPage();
	}

	return (
		<section aria-label="Lista de lojas">
			<div className="mb-4 flex items-start gap-3">
				<StoresSearch
					query={query}
					onQueryChange={handleSearch}
					className="mb-0 flex-1"
				/>
				<AddStoreModal />
			</div>
			{filteredStores.length === 0 ? (
				<div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-12 text-center">
					<Store
						aria-hidden="true"
						className="mx-auto mb-3 size-9 text-muted"
					/>
					<p className="font-semibold">Nenhuma loja encontrada</p>
					<p className="mt-1 text-sm text-muted">
						Tente buscar por outro nome ou endereço.
					</p>
				</div>
			) : (
				<>
					<ul className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{visibleStores.map((store) => (
							<li key={store.id} className="h-full">
								<StoreCard store={store} />
							</li>
						))}
					</ul>
					<nav
						className="mt-4 flex items-center justify-end gap-3"
						aria-label="Paginação de lojas"
					>
						<Button
							variant="outline"
							size="compact"
							onClick={goToPreviousPage}
							disabled={activePage === 1}
						>
							<ChevronRight aria-hidden="true" className="size-4 rotate-180" />
							Anterior
						</Button>
						<span className="text-sm font-medium text-muted" aria-live="polite">
							Página {activePage} de {totalPages}
						</span>
						<Button
							variant="outline"
							size="compact"
							onClick={goToNextPage}
							disabled={activePage === totalPages}
						>
							Próxima
							<ChevronRight aria-hidden="true" className="size-4" />
						</Button>
					</nav>
				</>
			)}
		</section>
	);
}
