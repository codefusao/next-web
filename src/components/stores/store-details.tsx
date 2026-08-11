"use client";

import { ArrowLeft, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteStoreDialog } from "@/components/stores/delete-store-dialog";
import { EditStoreForm } from "@/components/stores/edit-store-form";
import { StoreActionsMenu } from "@/components/stores/store-actions-menu";
import { StoreInformation } from "@/components/stores/store-information";
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
			<section className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-14 text-center">
				<Store
					aria-hidden="true"
					className="mx-auto mb-4 size-10 text-primary"
				/>
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
			</section>
		);
	}

	return (
		<section>
			<Link
				href="/stores"
				className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Voltar para lojas
			</Link>

			<div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-sm sm:p-7">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex items-start gap-4">
						<span className="rounded-lg bg-primary/10 p-3 text-primary">
							<Store aria-hidden="true" className="size-7" />
						</span>
						<div>
							<p className="text-sm font-semibold text-primary">Unidade</p>
							<h1 className="mt-1 text-3xl font-bold tracking-tight">
								{store.name}
							</h1>
						</div>
					</div>
					{isEditing ? null : (
						<StoreActionsMenu
							onEdit={() => setIsEditing(true)}
							onDelete={() => setIsDeleteDialogOpen(true)}
						/>
					)}
				</div>

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
