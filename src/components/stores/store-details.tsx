"use client";

import { ArrowLeft, Boxes, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteStoreDialog } from "@/components/stores/delete-store-dialog";
import { EditStoreModal } from "@/components/stores/edit-store-modal";
import { StoreActionCard } from "@/components/stores/store-action-card";
import { StoreActionsMenu } from "@/components/stores/store-actions-menu";
import { StoreLocationMap } from "@/components/stores/store-location-map";
import { defaultStoreImage } from "@/constants/store";
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
	const removeStoreInventory = useInventoryStore(
		(state) => state.removeStoreInventory,
	);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	function deleteStore() {
		removeStoreInventory(storeId);
		removeStore(storeId);
		toast.success("Loja removida da lista local.");
		router.replace("/stores");
	}

	if (!store) {
		return (
			<section className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 sm:py-8">
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
		<section>
			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
				<Link
					href="/stores"
					className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					<ArrowLeft aria-hidden="true" className="size-4" />
					Voltar para lojas
				</Link>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								{store.name}
							</h1>
							{store.cnpj ? (
								<span className="text-sm font-semibold text-muted">
									— CNPJ {store.cnpj}
								</span>
							) : null}
						</div>
						{store.address ? (
							<address className="mt-2 flex items-center gap-1.5 text-sm not-italic text-muted">
								<MapPin
									aria-hidden="true"
									className="size-4 shrink-0 text-primary"
								/>
								{store.address}
							</address>
						) : null}
					</div>
					<div className="sm:ml-auto">
						<StoreActionsMenu
							onEdit={() => setIsEditModalOpen(true)}
							onDelete={() => setIsDeleteDialogOpen(true)}
						/>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6">
				<div className="relative h-[32rem] overflow-hidden rounded-[var(--radius-card)] bg-foreground">
					<Image
						src={defaultStoreImage}
						alt="Imagem padrão de loja Leroy Merlin"
						fill
						priority
						sizes="(min-width: 1280px) 1280px, 100vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black/45" />
					<div className="relative flex h-full flex-col p-4 sm:p-6">
						<div className="mt-auto w-full max-w-xl self-end">
							<StoreLocationMap
								address={store.address}
								storeName={store.name}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
				<section aria-label="Ações da loja">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<StoreActionCard
							href={`/stores/${store.id}/inventory`}
							icon={Boxes}
							title="Estoque"
							description="Consulte produtos e ajuste as quantidades disponíveis."
						/>
					</div>
				</section>
			</div>

			<EditStoreModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				store={store}
			/>

			{isDeleteDialogOpen ? (
				<DeleteStoreDialog
					storeName={store.name}
					onCancel={() => setIsDeleteDialogOpen(false)}
					onConfirm={deleteStore}
				/>
			) : null}
		</section>
	);
}
