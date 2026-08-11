export const productCategories = [
	{ id: "tintas", label: "Tintas" },
	{ id: "sanitarios", label: "Sanitários" },
	{ id: "eletrica", label: "Elétrica" },
	{ id: "iluminacao", label: "Iluminação" },
	{ id: "cozinhas", label: "Cozinhas" },
	{ id: "pisos", label: "Pisos & Revestimentos" },
	{ id: "tapetes", label: "Tapetes & Cortinas" },
	{ id: "jardim", label: "Jardim" },
	{ id: "organizacao", label: "Organização" },
	{ id: "decoracao", label: "Decoração" },
	{ id: "hidraulica", label: "Hidráulica" },
	{ id: "ferramentas", label: "Ferramentas" },
	{ id: "materiais", label: "Materiais de construção" },
] as const;

export type ProductCategory = (typeof productCategories)[number];
