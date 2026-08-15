export const queryKeys = {
	auth: {
		currentSession: ["auth", "current-session"] as const,
	},
	companies: {
		all: ["companies"] as const,
		lists: ["companies", "list"] as const,
		list: (page: number, limit: number, query: string) =>
			["companies", "list", page, limit, query] as const,
		byId: (companyId: string) => ["companies", companyId] as const,
		inventory: (companyId: string, query?: string, page?: number) =>
			query === undefined
				? (["companies", companyId, "inventory"] as const)
				: (["companies", companyId, "inventory", query, page] as const),
		catalog: (companyId: string, query?: string, categoryId?: string, order?: string, page?: number) =>
			query === undefined
				? (["companies", companyId, "catalog"] as const)
				: (["companies", companyId, "catalog", query, categoryId, order, page] as const),
		storeMap: (companyId: string) =>
			["companies", companyId, "store-map"] as const,
	},
	products: {
		all: ["products"] as const,
		list: (query: string, categoryId: string, order: string, page: number, notInCompanyId?: string) =>
			["products", "list", query, categoryId, order, page, notInCompanyId] as const,
		byId: (productId: string) => ["products", productId] as const,
	},
} as const;
