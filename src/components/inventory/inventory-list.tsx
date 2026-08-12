"use client";

import { Boxes } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InventoryAdjustmentModal } from "@/components/inventory/inventory-adjustment-modal";
import { ProductTable } from "@/components/products/product-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { paginationPageSize } from "@/constants/pagination";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { filterProducts } from "@/lib/filter-products";
import { useInventoryStore } from "@/store/inventory-store";
import { useProductStore } from "@/store/product-store";
import type { InventoryItem } from "@/types/inventory";

type InventoryListProps = {
	storeId: string;
};

export function InventoryList({ storeId }: InventoryListProps) {
	const products = useProductStore((state) => state.products);
	const stockByProductId = useInventoryStore(
		(state) => state.stockByStoreId[storeId],
	);
	const updateStock = useInventoryStore((state) => state.updateStock);
	const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
	const inventoryItems = products.map((product) => ({
		...product,
		quantity: stockByProductId?.[product.id] ?? 0,
	}));
	const {
		activePage,
		goToNextPage,
		goToPreviousPage,
		filteredItems,
		query,
		setSearchQuery,
		totalPages,
		visibleItems,
	} = useSearchPagination({
		items: inventoryItems,
		itemsPerPage: paginationPageSize.inventory,
		filter: filterProducts,
	});

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
				onQueryChange={setSearchQuery}
				placeholder="Buscar por produto, código ou categoria"
				label="Buscar no estoque"
			/>
			{filteredItems.length === 0 ? (
				<EmptyState
					icon={Boxes}
					title="Nenhum produto encontrado"
					description="Tente buscar por outro produto, código ou categoria."
				/>
			) : (
				<>
					<ProductTable
						variant="inventory"
						products={visibleItems}
						onAdjust={setSelectedItem}
					/>
					<PaginationControls
						activePage={activePage}
						totalPages={totalPages}
						onPrevious={goToPreviousPage}
						onNext={goToNextPage}
						label="Paginação do estoque"
					/>
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
