import type { ProductCategory } from "@/constants/product-categories";

export type Product = {
	id: string;
	codigo: string;
	nome: string;
	categoria: ProductCategory;
	precos_e_condicoes: string[];
	imagem: string | null;
	imagem_thumb: string | null;
};
