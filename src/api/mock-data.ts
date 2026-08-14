import type { ProductCategory } from "@/constants/product-categories";
import mockProducts from "@/data/mock-products.json";
import mockStoreMetadata from "@/data/mock-store-metadata.json";
import mockStores from "@/data/mock-stores.json";
import { createDemoStockByStoreId, type StockByStoreId } from "@/lib/inventory";
import type {
	CompanyListItem,
	CompanyStatus,
	CompanyType,
} from "@/types/company";
import type { Product } from "@/types/product";
import type { StoreCatalogProduct } from "@/types/store-catalog";

// Temporary local-only presentation defaults. The backend Company resource does
// not provide these fields, so they must never be included in API payloads.
export const defaultCompanyInformation = {
	...mockStoreMetadata,
	status: mockStoreMetadata.status as CompanyStatus,
	type: mockStoreMetadata.type as CompanyType,
} satisfies Omit<
	CompanyListItem,
	| "id"
	| "parentId"
	| "name"
	| "cnpj"
	| "description"
	| "address"
	| "createdAt"
	| "updatedAt"
>;

export const initialCompanies: CompanyListItem[] = mockStores.map((store) => ({
	...store,
	...defaultCompanyInformation,
	parentId: null,
	description: null,
	createdAt: "1970-01-01T00:00:00.000Z",
	updatedAt: "1970-01-01T00:00:00.000Z",
}));

export const initialProducts: Product[] = mockProducts.map((product) => ({
	...product,
	categoria: product.categoria as ProductCategory,
}));

export const initialStockByStoreId: StockByStoreId = createDemoStockByStoreId(
	initialCompanies,
	initialProducts,
);

export const initialStoreCatalog: StoreCatalogProduct[] = [];
