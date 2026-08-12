import { create } from "zustand";
import type { ProductCategory } from "@/constants/product-categories";
import mockProducts from "@/data/mock-products.json";
import type { Product } from "@/types/product";

export type ProductPlaceholder = Product;

const initialProducts: ProductPlaceholder[] = mockProducts.map((product) => ({
	...product,
	categoria: product.categoria as ProductCategory,
}));

interface ProductState {
	products: ProductPlaceholder[];
	addProduct: (product: ProductPlaceholder) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
	products: initialProducts,
	addProduct: (product) =>
		set((state) => ({ products: [product, ...state.products] })),
}));
