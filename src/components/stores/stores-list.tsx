"use client";

import { ChevronRight, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddStoreModal } from "@/components/stores/add-store-modal";
import { StoresSearch } from "@/components/stores/stores-search";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { filterStores } from "@/lib/filter-stores";
import { useStoresStore } from "@/store/stores-store";

const storesPerPage = 9;
const defaultStoreImage =
	"https://cdn.leroymerlin.com.br/contents/rio_barra_c340_880x480.jpg";

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
					<ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{visibleStores.map((store) => (
							<li key={store.id}>
								<Link
									href={`/stores/${store.id}`}
									className="group block h-full overflow-hidden rounded-[var(--radius-card)] border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
								>
									<Image
										src={defaultStoreImage}
										alt={`Fachada da loja ${store.name}`}
										width={880}
										height={480}
										sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
										className="aspect-[11/6] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
									/>
									<div className="p-4">
										<h3 className="font-semibold text-foreground">
											{store.name}
										</h3>
										{store.address ? (
											<address className="mt-2 flex items-start gap-1.5 text-sm not-italic leading-6 text-muted">
												<MapPin
													aria-hidden="true"
													className="mt-1 size-4 shrink-0"
												/>
												<span>{store.address}</span>
											</address>
										) : null}
									</div>
								</Link>
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
