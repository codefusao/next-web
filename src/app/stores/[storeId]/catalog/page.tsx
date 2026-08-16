import { Catalog } from "@/components/catalog/catalog";

type StoreCatalogPageProps = {
	params: Promise<{ storeId: string }>;
};

export default async function StoreCatalogPage({
	params,
}: StoreCatalogPageProps) {
	const { storeId } = await params;

	return <Catalog storeId={storeId} />;
}
