export const queryKeys = {
	auth: {
		currentSession: ["auth", "current-session"] as const,
	},
	companies: {
		all: ["companies"] as const,
		list: (page: number, limit: number, query: string) =>
			["companies", "list", page, limit, query] as const,
		byId: (companyId: string) => ["companies", companyId] as const,
		inventory: (companyId: string) =>
			["companies", companyId, "inventory"] as const,
		catalog: (companyId: string) =>
			["companies", companyId, "catalog"] as const,
	},
	products: {
		all: ["products"] as const,
		byId: (productId: string) => ["products", productId] as const,
	},
} as const;
