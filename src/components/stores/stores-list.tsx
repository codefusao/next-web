"use client";

import { Store } from "lucide-react";
import { useState } from "react";
import { AddStoreModal } from "@/components/stores/modals/add-store-modal";
import { StoreCard } from "@/components/stores/store-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { useCompaniesQuery } from "@/hooks/use-companies-query";

export function StoresList() {
	const [activePage, setActivePage] = useState(1);
	const [query, setQuery] = useState("");
	const { data } = useCompaniesQuery(activePage, query);
	const companies = data?.companies ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	function setSearchQuery(nextQuery: string) {
		setQuery(nextQuery);
		setActivePage(1);
	}

	function goToPreviousPage() {
		setActivePage((page) => Math.max(1, page - 1));
	}

	function goToNextPage() {
		setActivePage((page) => Math.min(totalPages, page + 1));
	}

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
			{companies.length === 0 ? (
				<EmptyState
					icon={Store}
					title="Nenhuma loja encontrada"
					description="Tente buscar por outro nome ou endereço."
				/>
			) : (
				<>
					<ul className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{companies.map((store) => (
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
