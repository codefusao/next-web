"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { InteractiveStoreMap } from "@/components/catalog/map/interactive-store-map";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
	type StoreCatalogLocationFields,
	storeCatalogLocationSchema,
} from "@/schemas/store-catalog";
import type { CompanyListItem } from "@/types/company";
import type { Product } from "@/types/product";
import type { StoreMapPosition } from "@/types/store-catalog";

type CatalogLocationMapModalProps = {
	store: CompanyListItem;
	storeMapUrl: string | null;
	product: Product;
	initialPosition?: StoreCatalogLocationFields;
	onClose: () => void;
	onSave: (position: StoreCatalogLocationFields) => void;
};

export function CatalogLocationMapModal({
	store,
	storeMapUrl,
	product,
	initialPosition,
	onClose,
	onSave,
}: CatalogLocationMapModalProps) {
	const {
		handleSubmit,
		register,
		setValue,
		watch,
		formState: { errors },
	} = useForm<StoreCatalogLocationFields>({
		resolver: zodResolver(storeCatalogLocationSchema),
		defaultValues: {
			description: initialPosition?.description ?? "",
			x: initialPosition?.x,
			y: initialPosition?.y,
		},
		reValidateMode: "onChange",
	});
	const coordinates = watch();
	const selectedPosition =
		coordinates.x === undefined || coordinates.y === undefined
			? null
			: coordinates;
	const locationError = errors.x?.message ?? errors.y?.message;
	const descriptionError = errors.description?.message;
	const isEditing = Boolean(initialPosition);

	function selectPosition(position: StoreMapPosition) {
		setValue("x", position.x, { shouldDirty: true, shouldValidate: true });
		setValue("y", position.y, { shouldDirty: true, shouldValidate: true });
	}

	return (
		<Modal
			title={isEditing ? "Editar localização" : "Marcar localização"}
			description={`${product.nome}. Clique no ponto onde o produto fica dentro da loja.`}
			closeLabel="Fechar seleção de localização"
			onClose={onClose}
			size="lg"
			layout="scrollable"
		>
			<form onSubmit={handleSubmit(onSave)} noValidate className="mt-6">
				<InteractiveStoreMap
					storeMapUrl={storeMapUrl}
					storeName={store.name}
					selectedPosition={selectedPosition}
					onPositionSelect={selectPosition}
				/>
				<p className="mt-3 flex items-center gap-2 text-sm text-muted">
					<MapPin aria-hidden="true" className="size-4 text-primary" />
					{selectedPosition
						? "Posição selecionada. Clique novamente para alterá-la."
						: "Nenhuma posição selecionada."}
				</p>
				{locationError ? (
					<p role="alert" className="mt-2 text-sm font-medium text-destructive">
						{locationError}
					</p>
				) : null}
				<label className="mt-5 block">
					<span className="text-sm font-bold text-foreground">
						Descrição da localização
					</span>
					<input
						{...register("description")}
						type="text"
						placeholder="Ex.: Corredor 5 - Gaveta 2"
						className="mt-2 h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] border-border bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary"
						aria-invalid={Boolean(descriptionError)}
						aria-describedby={
							descriptionError ? "location-description-error" : undefined
						}
					/>
					{descriptionError ? (
						<p
							id="location-description-error"
							role="alert"
							className="mt-2 text-sm font-medium text-destructive"
						>
							{descriptionError}
						</p>
					) : null}
				</label>
				<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" disabled={!selectedPosition}>
						<Save aria-hidden="true" className="size-5" />
						{isEditing ? "Salvar posição" : "Adicionar ao catálogo"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
