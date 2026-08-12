"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteStoreDialog } from "@/components/stores/delete-store-dialog";
import { EditStoreModal } from "@/components/stores/edit-store-modal";
import { StoreBannerModal } from "@/components/stores/store-banner-modal";
import { StoreDetailsHero } from "@/components/stores/store-details-hero";
import { StoreMapUploadModal } from "@/components/stores/store-map-upload-modal";
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
	const updateStoreBanner = useStoresStore((state) => state.updateStoreBanner);
	const updateStoreMap = useStoresStore((state) => state.updateStoreMap);
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
			<section className="mx-auto w-full max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
				<div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-14">
					<h1 className="text-2xl font-bold">Loja não encontrada</h1>
					<p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
						A loja solicitada não está disponível na lista local.
					</p>
					<Link
						href="/stores"
						className="mt-6 inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						<ArrowLeft aria-hidden="true" className="size-4" />
						Voltar para lojas
					</Link>
				</div>
			</section>
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
						updateStoreBanner(store.id, bannerUrl);
						toast.success("Banner da loja atualizado.");
						setIsBannerModalOpen(false);
					}}
				/>
			) : null}

			{isMapUploadModalOpen ? (
				<StoreMapUploadModal
					onClose={() => setIsMapUploadModalOpen(false)}
					onSave={(storeMapUrl) => {
						updateStoreMap(store.id, storeMapUrl);
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
