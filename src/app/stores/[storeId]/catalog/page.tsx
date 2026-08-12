import { StoreCatalog } from "@/components/stores/store-catalog";

type StoreCatalogPageProps = {
	params: Promise<{ storeId: string }>;
};

export default async function StoreCatalogPage({
	params,
}: StoreCatalogPageProps) {
	const { storeId } = await params;

	return <StoreCatalog storeId={storeId} />;
}
