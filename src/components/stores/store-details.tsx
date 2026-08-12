"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteStoreDialog } from "@/components/stores/delete-store-dialog";
import { ClearStoreCatalogDialog } from "@/components/stores/clear-store-catalog-dialog";
import { EditStoreModal } from "@/components/stores/edit-store-modal";
import { StoreBannerModal } from "@/components/stores/store-banner-modal";
import { StoreDetailsHero } from "@/components/stores/store-details-hero";
import { StoreMapUploadModal } from "@/components/stores/store-map-upload-modal";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import { StoreOverview } from "@/components/stores/store-overview";
import { useInventoryStore } from "@/store/inventory-store";
import {
	emptyStoreCatalogItems,
	useStoreCatalogStore,
} from "@/store/store-catalog-store";
import { useStoresStore } from "@/store/stores-store";

type StoreDetailsProps = {
	storeId: string;
};

export function StoreDetails({ storeId }: StoreDetailsProps) {
	const router = useRouter();
	const store = useStoresStore((state) =>
		state.stores.find((item) => item.id === storeId),
	);
	const removeStore = useStoresStore((state) => state.removeStore);
	const patchStore = useStoresStore((state) => state.patchStore);
	const removeStoreInventory = useInventoryStore(
		(state) => state.removeStoreInventory,
	);
	const catalogItems = useStoreCatalogStore(
		(state) => state.catalogByStoreId[storeId] ?? emptyStoreCatalogItems,
	);
	const clearStoreCatalog = useStoreCatalogStore(
		(state) => state.clearStoreCatalog,
	);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
	const [isMapUploadModalOpen, setIsMapUploadModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [pendingStoreMapUrl, setPendingStoreMapUrl] = useState<string | null>(
		null,
	);

	function deleteStore() {
		removeStoreInventory(storeId);
		clearStoreCatalog(storeId);
		removeStore(storeId);
		toast.success("Loja removida da lista local.");
		router.replace("/stores");
	}

	function saveStoreMap(storeMapUrl: string) {
		setIsMapUploadModalOpen(false);
		if (catalogItems.length > 0) {
			setPendingStoreMapUrl(storeMapUrl);
			return;
		}

		patchStore(storeId, { storeMapUrl });
		toast.success("Mapa da loja atualizado.");
	}

	function confirmStoreMapChange() {
		if (!pendingStoreMapUrl) return;

		clearStoreCatalog(storeId);
		patchStore(storeId, { storeMapUrl: pendingStoreMapUrl });
		setPendingStoreMapUrl(null);
		toast.success("Mapa atualizado e localizações do catálogo removidas.");
	}

	if (!store) {
		return (
			<StoreNotFoundState className="mx-auto w-full max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8" />
		);
	}

	return (
		<>
			<section className="mx-auto w-full max-w-7xl lg:px-8">
				<StoreDetailsHero store={store} />
				<StoreOverview
					store={store}
					onEdit={() => setIsEditModalOpen(true)}
					onChangeBanner={() => setIsBannerModalOpen(true)}
					onChangeMap={() => setIsMapUploadModalOpen(true)}
					onDelete={() => setIsDeleteDialogOpen(true)}
				/>
			</section>

			<EditStoreModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				store={store}
			/>

			{isBannerModalOpen ? (
				<StoreBannerModal
					bannerUrl={store.bannerUrl}
					onClose={() => setIsBannerModalOpen(false)}
					onSave={(bannerUrl) => {
						patchStore(store.id, { bannerUrl });
						toast.success("Banner da loja atualizado.");
						setIsBannerModalOpen(false);
					}}
				/>
			) : null}

			{isMapUploadModalOpen ? (
				<StoreMapUploadModal
					onClose={() => setIsMapUploadModalOpen(false)}
					onSave={saveStoreMap}
				/>
			) : null}

			{isDeleteDialogOpen ? (
				<DeleteStoreDialog
					storeName={store.name}
					onCancel={() => setIsDeleteDialogOpen(false)}
					onConfirm={deleteStore}
				/>
			) : null}

			{pendingStoreMapUrl ? (
				<ClearStoreCatalogDialog
					onCancel={() => setPendingStoreMapUrl(null)}
					onConfirm={confirmStoreMapChange}
				/>
			) : null}
		</>
	);
}
