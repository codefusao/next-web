export type ProductCategory = { id: string; label: string };

export type Product = {
	id: string;
	nome: string;
	categoria: ProductCategory;
	precos_e_condicoes: string[];
	image: string | null;
};

export const productOrder = {
	name: "name",
	category: "category",
} as const;

export type ProductOrder = (typeof productOrder)[keyof typeof productOrder];

export type ProductListQuery = {
	page?: number;
	limit?: number;
	query?: string;
	categoryId?: string;
	order?: ProductOrder;
	notInCompanyId?: string;
};

export type PaginationMeta = {
	totalPages: number;
	currentPage: number;
	totalRecords: number;
};

export type ProductListResult = {
	products: Product[];
	meta: PaginationMeta;
};
