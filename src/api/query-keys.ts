export const queryKeys = {
	auth: {
		currentSession: ["auth", "current-session"] as const,
	},
	stores: {
		all: ["stores"] as const,
		inventory: (storeId: string) => ["stores", storeId, "inventory"] as const,
		catalog: (storeId: string) => ["stores", storeId, "catalog"] as const,
	},
	products: {
		all: ["products"] as const,
		byId: (productId: string) => ["products", productId] as const,
	},
} as const;
