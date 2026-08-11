import { create } from "zustand";

import type { ProductCategory } from "@/constants/product-categories";

export type ProductPlaceholder = {
	id: string;
	codigo: string;
	nome: string;
	categoria: ProductCategory;
	precos_e_condicoes: string[];
	imagem: string | null;
	imagem_thumb: string | null;
};

interface ProductState {
	products: ProductPlaceholder[];
	addProduct: (product: ProductPlaceholder) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
	products: [],
	addProduct: (product) =>
		set((state) => ({ products: [product, ...state.products] })),
}));
