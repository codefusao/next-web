import type { ProductCategory } from "@/constants/product-categories";
import mockProducts from "@/data/mock-products.json";
import mockStoreMetadata from "@/data/mock-store-metadata.json";
import mockStores from "@/data/mock-stores.json";
import { createDemoStockByStoreId, type StockByStoreId } from "@/lib/inventory";
import type { Product } from "@/types/product";
import type { StoreListItem, StoreStatus, StoreType } from "@/types/store";
import type { StoreCatalogProduct } from "@/types/store-catalog";

export const defaultStoreMetadata = {
	...mockStoreMetadata,
	status: mockStoreMetadata.status as StoreStatus,
	type: mockStoreMetadata.type as StoreType,
} satisfies Omit<
	StoreListItem,
	"id" | "parentId" | "name" | "cnpj" | "description" | "address"
>;

export const initialStores: StoreListItem[] = mockStores.map((store) => ({
	...store,
	...defaultStoreMetadata,
}));

export const initialProducts: Product[] = mockProducts.map((product) => ({
	...product,
	categoria: product.categoria as ProductCategory,
}));

export const initialStockByStoreId: StockByStoreId = createDemoStockByStoreId(
	initialStores,
	initialProducts,
);

export const initialStoreCatalog: StoreCatalogProduct[] = [];
