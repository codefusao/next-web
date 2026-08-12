"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteStoreDialog } from "@/components/stores/delete-store-dialog";
import { EditStoreModal } from "@/components/stores/edit-store-modal";
import { StoreBannerModal } from "@/components/stores/store-banner-modal";
import { StoreDetailsHero } from "@/components/stores/store-details-hero";
import { StoreMapUploadModal } from "@/components/stores/store-map-upload-modal";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import { StoreOverview } from "@/components/stores/store-overview";
import { useInventoryStore } from "@/store/inventory-store";
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
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
	const [isMapUploadModalOpen, setIsMapUploadModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	function deleteStore() {
		removeStoreInventory(storeId);
		removeStore(storeId);
		toast.success("Loja removida da lista local.");
		router.replace("/stores");
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
					onSave={(storeMapUrl) => {
						patchStore(store.id, { storeMapUrl });
						toast.success("Mapa da loja atualizado.");
						setIsMapUploadModalOpen(false);
					}}
				/>
			) : null}

			{isDeleteDialogOpen ? (
				<DeleteStoreDialog
					storeName={store.name}
					onCancel={() => setIsDeleteDialogOpen(false)}
					onConfirm={deleteStore}
				/>
			) : null}
		</>
	);
}
