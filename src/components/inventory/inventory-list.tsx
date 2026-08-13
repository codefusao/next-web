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
import {
	useInventoryQuery,
	useUpdateInventoryMutation,
} from "@/hooks/use-inventory-query";
import { useProductsQuery } from "@/hooks/use-products-query";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { filterProducts } from "@/lib/filter-products";
import type { InventoryItem } from "@/types/inventory";

type InventoryListProps = {
	storeId: string;
};

export function InventoryList({ storeId }: InventoryListProps) {
	const { data: products = [] } = useProductsQuery();
	const { data: stockByProductId = {} } = useInventoryQuery(storeId);
	const updateInventory = useUpdateInventoryMutation();
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

	async function saveAdjustment(quantity: number) {
		if (!selectedItem) return;

		try {
			await updateInventory.mutateAsync({
				storeId,
				productId: selectedItem.id,
				quantity,
			});
			toast.success("Estoque atualizado com sucesso.");
			setSelectedItem(null);
		} catch {
			toast.error("Não foi possível atualizar o estoque.");
		}
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
