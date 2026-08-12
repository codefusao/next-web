import { StoreInventory } from "@/components/stores/store-inventory";

type StoreInventoryPageProps = {
	params: Promise<{ storeId: string }>;
};

export default async function StoreInventoryPage({
	params,
}: StoreInventoryPageProps) {
	const { storeId } = await params;

	return <StoreInventory storeId={storeId} />;
}
