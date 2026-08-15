"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import type { Department } from "@/api/departments";

type CatalogLocationMapModalProps = {
	store: CompanyListItem;
	storeMapUrl: string | null;
	product: Product;
	departments: readonly Department[];
	onCreateDepartment: (name: string) => Promise<string>;
	initialPosition?: Partial<StoreCatalogLocationFields>;
	onClose: () => void;
	onSave: (position: StoreCatalogLocationFields) => void;
};

export function CatalogLocationMapModal({
	store,
	storeMapUrl,
	product,
	departments,
	onCreateDepartment,
	initialPosition,
	onClose,
	onSave,
}: CatalogLocationMapModalProps) {
	const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
	const {
		handleSubmit,
		register,
		setValue,
		watch,
		formState: { errors },
	} = useForm<StoreCatalogLocationFields>({
		resolver: zodResolver(storeCatalogLocationSchema),
		defaultValues: {
			departmentId: initialPosition?.departmentId ?? "",
			aisle: initialPosition?.aisle ?? "",
			shelf: initialPosition?.shelf ?? "",
			module: initialPosition?.module ?? "",
			level: initialPosition?.level ?? "",
			x: initialPosition?.x,
			y: initialPosition?.y,
		},
		reValidateMode: "onChange",
	});
	const departmentForm = useForm<{ name: string }>({
		resolver: zodResolver(z.object({ name: z.string().trim().min(2, "Informe o nome do departamento") })),
		defaultValues: { name: "" },
	});
	const coordinates = watch();
	const selectedPosition =
		coordinates.x === undefined || coordinates.y === undefined
			? null
			: coordinates;
	const locationError = errors.x?.message ?? errors.y?.message;
	const isEditing = Boolean(initialPosition);

	function selectPosition(position: StoreMapPosition) {
		setValue("x", position.x, { shouldDirty: true, shouldValidate: true });
		setValue("y", position.y, { shouldDirty: true, shouldValidate: true });
	}

	async function createDepartment({ name }: { name: string }) {
		const departmentId = await onCreateDepartment(name);
		setValue("departmentId", departmentId, { shouldDirty: true, shouldValidate: true });
		departmentForm.reset();
		setIsDepartmentModalOpen(false);
	}

	return (
		<>
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
					<span className="text-sm font-bold text-foreground">Departamento</span>
					<div className="mt-2 flex gap-2">
						<select
							{...register("departmentId")}
							className="h-[var(--control-height-input)] min-w-0 flex-1 rounded-[var(--radius-control)] border-[1.5px] border-border bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors focus:border-primary"
						>
							<option value="">Selecione um departamento</option>
							{departments.map((department) => (
								<option key={department.id} value={department.id}>{department.name}</option>
							))}
						</select>
						<Button type="button" variant="outline" onClick={() => setIsDepartmentModalOpen(true)}>Criar departamento</Button>
					</div>
					{errors.departmentId?.message ? <p role="alert" className="mt-2 text-sm font-medium text-destructive">{errors.departmentId.message}</p> : null}
				</label>
				<div className="mt-5 grid gap-4 sm:grid-cols-2">
					{(["aisle", "shelf", "module", "level"] as const).map((field) => (
						<label key={field}>
							<span className="text-sm font-bold text-foreground">{{ aisle: "Corredor", shelf: "Prateleira", module: "Módulo", level: "Nível" }[field]}</span>
							<input {...register(field)} className="mt-2 h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] border-border bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors focus:border-primary" />
							{errors[field]?.message ? <p role="alert" className="mt-2 text-sm font-medium text-destructive">{errors[field]?.message}</p> : null}
						</label>
					))}
				</div>
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
		{isDepartmentModalOpen ? (
			<Modal
				title="Criar departamento"
				description="Cadastre o departamento antes de definir a localização."
				closeLabel="Fechar criação de departamento"
				onClose={() => setIsDepartmentModalOpen(false)}
			>
				<form onSubmit={departmentForm.handleSubmit(createDepartment)} noValidate className="mt-6">
					<label className="block">
						<span className="text-sm font-bold text-foreground">Nome do departamento</span>
						<input {...departmentForm.register("name")} className="mt-2 h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] border-border bg-background px-3.5 text-[15px] text-foreground outline-none focus:border-primary" aria-invalid={Boolean(departmentForm.formState.errors.name)} />
						{departmentForm.formState.errors.name?.message ? <p role="alert" className="mt-2 text-sm font-medium text-destructive">{departmentForm.formState.errors.name.message}</p> : null}
					</label>
					<div className="mt-6 flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={() => setIsDepartmentModalOpen(false)}>Cancelar</Button>
						<Button type="submit">Criar departamento</Button>
					</div>
				</form>
			</Modal>
		) : null}
		</>
	);
}
