import type { ProductCategory } from "@/constants/product-categories";
import mockProducts from "@/data/mock-products.json";
import mockStoreMetadata from "@/data/mock-store-metadata.json";
import mockStores from "@/data/mock-stores.json";
import { createDemoStockByStoreId, type StockByStoreId } from "@/lib/inventory";
import type { CompanyListItem, CompanyStatus } from "@/types/company";
import type { Product } from "@/types/product";
import type { StoreCatalogProduct } from "@/types/store-catalog";

// Product inventory remains local-only until its backend integration is built.
const demoCompanyInformation = {
	bannerUrl: mockStoreMetadata.bannerUrl,
	status: mockStoreMetadata.status as CompanyStatus,
	manager: mockStoreMetadata.manager,
	phone: mockStoreMetadata.phone,
	email: mockStoreMetadata.email,
	area: mockStoreMetadata.area,
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

const initialDemoCompanies: CompanyListItem[] = mockStores.map((store) => ({
	...store,
	...demoCompanyInformation,
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
	initialDemoCompanies,
	initialProducts,
);

export const initialStoreCatalog: StoreCatalogProduct[] = [];
