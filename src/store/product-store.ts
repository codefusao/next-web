import { create } from "zustand";
import type { ProductCategory } from "@/constants/product-categories";
import mockProducts from "@/data/mock-products.json";
import type { Product } from "@/types/product";

const initialProducts: Product[] = mockProducts.map((product) => ({
	...product,
	categoria: product.categoria as ProductCategory,
}));

interface ProductState {
	products: Product[];
	addProduct: (product: Product) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
	products: initialProducts,
	addProduct: (product) =>
		set((state) => ({ products: [product, ...state.products] })),
}));
