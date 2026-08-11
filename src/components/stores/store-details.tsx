"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteStoreDialog } from "@/components/stores/delete-store-dialog";
import { EditStoreForm } from "@/components/stores/edit-store-form";
import { StoreActionsMenu } from "@/components/stores/store-actions-menu";
import { StoreInformation } from "@/components/stores/store-information";
import { StoreLocationMap } from "@/components/stores/store-location-map";
import { defaultStoreImage } from "@/constants/store";
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
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	function deleteStore() {
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
			<h1 className="sr-only">Detalhes da loja {store.name}</h1>
			<div className="relative min-h-[38rem] overflow-hidden bg-foreground">
				<Image
					src={defaultStoreImage}
					alt="Imagem padrão de loja Leroy Merlin"
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-black/45" />
				<div className="relative mx-auto flex min-h-[38rem] max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8">
					<div className="flex items-start justify-between gap-4">
						<Link
							href="/stores"
							className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-card/95 px-3 py-2 text-sm font-bold text-primary shadow-sm backdrop-blur-sm hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						>
							<ArrowLeft aria-hidden="true" className="size-4" />
							Voltar para lojas
						</Link>
						{isEditing ? null : (
							<div className="rounded-[var(--radius-control)] bg-card/95 p-1 shadow-sm backdrop-blur-sm">
								<StoreActionsMenu
									onEdit={() => setIsEditing(true)}
									onDelete={() => setIsDeleteDialogOpen(true)}
								/>
							</div>
						)}
					</div>
					<div className="mt-auto w-full max-w-xl self-end">
						<StoreLocationMap address={store.address} storeName={store.name} />
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
				{isEditing ? (
					<EditStoreForm
						store={store}
						onCancel={() => setIsEditing(false)}
						onSave={() => setIsEditing(false)}
					/>
				) : (
					<StoreInformation store={store} />
				)}
			</div>

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
