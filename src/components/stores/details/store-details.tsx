"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { StoreDetailsHero } from "@/components/stores/details/store-details-hero";
import { StoreOverview } from "@/components/stores/details/store-overview";
import { DeleteStoreDialog } from "@/components/stores/modals/delete-store-dialog";
import { EditStoreModal } from "@/components/stores/modals/edit-store-modal";
import { StoreBannerModal } from "@/components/stores/modals/store-banner-modal";
import { StoreMapUploadModal } from "@/components/stores/modals/store-map-upload-modal";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import {
	useDeleteStoreMutation,
	useStoresQuery,
	useUpdateStoreMutation,
} from "@/hooks/use-stores-query";

type StoreDetailsProps = {
	storeId: string;
};

enum StoreDetailsMutationDialogType {
	Idle = "idle",
	Edit = "edit",
	Banner = "banner",
	Map = "map",
	Delete = "delete",
}

export function StoreDetails({ storeId }: StoreDetailsProps) {
	const router = useRouter();
	const { data: stores = [] } = useStoresQuery();
	const deleteStoreMutation = useDeleteStoreMutation();
	const updateStoreMutation = useUpdateStoreMutation();
	const store = stores.find((item) => item.id === storeId);
	const [mutationDialog, setMutationDialog] = useState(
		StoreDetailsMutationDialogType.Idle,
	);

	async function deleteStore() {
		try {
			await deleteStoreMutation.mutateAsync(storeId);
			toast.success("Loja removida com sucesso.");
			router.replace("/stores");
		} catch {
			toast.error("Não foi possível remover a loja.");
		}
	}

	async function saveStoreMap(storeMapUrl: string) {
		if (!store) return;

		setMutationDialog(StoreDetailsMutationDialogType.Idle);
		try {
			await updateStoreMutation.mutateAsync({
				store,
				changes: { storeMapUrl },
			});
			toast.success("Mapa da loja atualizado.");
		} catch {
			toast.error("Não foi possível atualizar o mapa da loja.");
		}
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
					onEdit={() => setMutationDialog(StoreDetailsMutationDialogType.Edit)}
					onChangeBanner={() =>
						setMutationDialog(StoreDetailsMutationDialogType.Banner)
					}
					onChangeMap={() =>
						setMutationDialog(StoreDetailsMutationDialogType.Map)
					}
					onDelete={() =>
						setMutationDialog(StoreDetailsMutationDialogType.Delete)
					}
				/>
			</section>

			<EditStoreModal
				isOpen={mutationDialog === StoreDetailsMutationDialogType.Edit}
				onClose={() => setMutationDialog(StoreDetailsMutationDialogType.Idle)}
				store={store}
			/>

			{mutationDialog === StoreDetailsMutationDialogType.Banner ? (
				<StoreBannerModal
					bannerUrl={store.bannerUrl}
					onClose={() => setMutationDialog(StoreDetailsMutationDialogType.Idle)}
					onSave={async (bannerUrl) => {
						try {
							await updateStoreMutation.mutateAsync({
								store,
								changes: { bannerUrl },
							});
							toast.success("Banner da loja atualizado.");
							setMutationDialog(StoreDetailsMutationDialogType.Idle);
						} catch {
							toast.error("Não foi possível atualizar o banner da loja.");
						}
					}}
				/>
			) : null}

			{mutationDialog === StoreDetailsMutationDialogType.Map ? (
				<StoreMapUploadModal
					onClose={() => setMutationDialog(StoreDetailsMutationDialogType.Idle)}
					onSave={saveStoreMap}
				/>
			) : null}

			{mutationDialog === StoreDetailsMutationDialogType.Delete ? (
				<DeleteStoreDialog
					storeName={store.name}
					onCancel={() =>
						setMutationDialog(StoreDetailsMutationDialogType.Idle)
					}
					onConfirm={deleteStore}
				/>
			) : null}
		</>
	);
}
