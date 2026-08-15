import { StoreLocationNotifications } from "@/components/stores/store-location-notifications";

type StoreNotificationsPageProps = { params: Promise<{ storeId: string }> };

export default async function StoreNotificationsPage({ params }: StoreNotificationsPageProps) {
	const { storeId } = await params;
	return <StoreLocationNotifications storeId={storeId} />;
}
