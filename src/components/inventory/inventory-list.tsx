"use client";

import { Boxes, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InventoryAdjustmentModal } from "@/components/inventory/inventory-adjustment-modal";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { usePagination } from "@/hooks/use-pagination";
import { filterProducts } from "@/lib/filter-products";
import { useInventoryStore } from "@/store/inventory-store";
import { useProductStore } from "@/store/product-store";
import type { InventoryItem } from "@/types/inventory";

const itemsPerPage = 10;

type InventoryListProps = {
	storeId: string;
};

export function InventoryList({ storeId }: InventoryListProps) {
	const products = useProductStore((state) => state.products);
	const stockByProductId = useInventoryStore(
		(state) => state.stockByStoreId[storeId],
	);
	const updateStock = useInventoryStore((state) => state.updateStock);
	const [query, setQuery] = useState("");
	const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
	const inventoryItems = products.map((product) => ({
		...product,
		quantity: stockByProductId?.[product.id] ?? 0,
	}));
	const filteredItems = filterProducts(inventoryItems, query);
	const {
		activePage,
		goToNextPage,
		goToPreviousPage,
		resetPage,
		totalPages,
		visibleItems,
	} = usePagination(filteredItems, itemsPerPage);

	function handleSearch(nextQuery: string) {
		setQuery(nextQuery);
		resetPage();
	}

	function saveAdjustment(quantity: number) {
		if (!selectedItem) return;

		updateStock(storeId, selectedItem.id, quantity);
		toast.success("Estoque atualizado com sucesso.");
		setSelectedItem(null);
	}

	return (
		<section aria-label="Estoque da loja" className="mt-6">
			<SearchInput
				query={query}
				onQueryChange={handleSearch}
				placeholder="Buscar por produto, código ou categoria"
				label="Buscar no estoque"
			/>
			{filteredItems.length === 0 ? (
				<div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-12 text-center">
					<Boxes
						aria-hidden="true"
						className="mx-auto mb-3 size-9 text-muted"
					/>
					<p className="font-semibold">Nenhum produto encontrado</p>
					<p className="mt-1 text-sm text-muted">
						Tente buscar por outro produto, código ou categoria.
					</p>
				</div>
			) : (
				<>
					<div className="overflow-x-auto rounded-[var(--radius-card)] border border-border bg-card">
						<table className="min-w-full text-left text-sm">
							<thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-muted">
								<tr>
									<th className="px-4 py-3 font-semibold">Imagem</th>
									<th className="px-4 py-3 font-semibold">Código</th>
									<th className="px-4 py-3 font-semibold">Produto</th>
									<th className="px-4 py-3 font-semibold">Categoria</th>
									<th className="px-4 py-3 font-semibold">Quantidade</th>
									<th className="px-4 py-3 font-semibold">
										<span className="sr-only">Ações</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{visibleItems.map((item) => (
									<tr
										key={item.id}
										className="border-b border-border last:border-0"
									>
										<td className="px-4 py-3">
											<ProductThumbnail
												source={item.imagem_thumb ?? item.imagem}
												productName={item.nome}
											/>
										</td>
										<td className="whitespace-nowrap px-4 py-4 font-semibold">
											{item.codigo}
										</td>
										<td className="min-w-56 px-4 py-4 font-medium">
											{item.nome}
										</td>
										<td className="whitespace-nowrap px-4 py-4 text-muted">
											{item.categoria.label}
										</td>
										<td className="whitespace-nowrap px-4 py-4 text-lg font-bold text-foreground">
											{item.quantity}
										</td>
										<td className="px-4 py-4">
											<Button
												variant="outline"
												size="compact"
												onClick={() => setSelectedItem(item)}
											>
												<Pencil aria-hidden="true" className="size-4" />
												Ajustar
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<nav
						className="mt-4 flex items-center justify-end gap-3"
						aria-label="Paginação do estoque"
					>
						<Button
							variant="outline"
							size="compact"
							onClick={goToPreviousPage}
							disabled={activePage === 1}
						>
							<ChevronLeft aria-hidden="true" className="size-4" />
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
			{selectedItem ? (
				<InventoryAdjustmentModal
					item={selectedItem}
					onClose={() => setSelectedItem(null)}
					onSave={saveAdjustment}
				/>
			) : null}
		</section>
	);
}
