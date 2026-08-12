import { demoStockConfig } from "@/constants/inventory";

type Identifiable = {
	id: string;
};

export type StockByStoreId = Record<string, Record<string, number>>;

function hashValue(value: string) {
	let hash = 0;

	for (const character of value) {
		hash =
			(hash * demoStockConfig.hashMultiplier + character.charCodeAt(0)) >>> 0;
	}

	return hash;
}

export function getDemoStockQuantity(storeId: string, productId: string) {
	const hash = hashValue(`${storeId}:${productId}`);

	return hash % demoStockConfig.zeroStockDivisor === 0
		? 0
		: (hash % demoStockConfig.maximumQuantity) +
				demoStockConfig.minimumQuantity;
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
