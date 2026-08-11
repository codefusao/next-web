import { StoreDetails } from "@/components/stores/store-details";

type StoreDetailsPageProps = {
	params: Promise<{ storeId: string }>;
};

export default async function StoreDetailsPage({
	params,
}: StoreDetailsPageProps) {
	const { storeId } = await params;

	return <StoreDetails storeId={storeId} />;
}
