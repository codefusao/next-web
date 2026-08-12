type Identifiable = {
	id: string;
};

export type StockByStoreId = Record<string, Record<string, number>>;

function hashValue(value: string) {
	let hash = 0;

	for (const character of value) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return hash;
}

export function getDemoStockQuantity(storeId: string, productId: string) {
	const hash = hashValue(`${storeId}:${productId}`);

	return hash % 11 === 0 ? 0 : (hash % 240) + 10;
}

export function createDemoStockByStoreId(
	stores: readonly Identifiable[],
	products: readonly Identifiable[],
): StockByStoreId {
	return Object.fromEntries(
		stores.map((store) => [
			store.id,
			Object.fromEntries(
				products.map((product) => [
					product.id,
					getDemoStockQuantity(store.id, product.id),
				]),
			),
		]),
	) as StockByStoreId;
}
