"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Crosshair, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InteractiveStoreMap } from "@/components/catalog/map/interactive-store-map";
import { Button } from "@/components/ui/button";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { useSaveStoreMapReferencePointsMutation } from "@/hooks/use-store-map-query";
import type { StoreMapPosition } from "@/types/store-catalog";
import type { StoreMap, StoreMapReferencePoint } from "@/types/store-map";

const referencePointSchema = z.object({
	x: z.number().min(0).max(100),
	y: z.number().min(0).max(100),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
});
const referencePointsSchema = z.object({
	referencePoints: z.array(referencePointSchema).length(4),
});

type ReferencePointFormInputs = z.input<typeof referencePointsSchema>;
type ReferencePointFields = z.output<typeof referencePointsSchema>;

const emptyReferencePoints = Array.from({ length: 4 }, () => ({})) as ReferencePointFormInputs["referencePoints"];

type StoreMapReferencePointsModalProps = {
	store: { name: string };
	storeMap: StoreMap;
	onClose: () => void;
};

function toMapPosition(point: Partial<StoreMapReferencePoint>): StoreMapPosition | null {
	return typeof point.x === "number" && typeof point.y === "number"
		? { x: point.x, y: point.y }
		: null;
}

export function StoreMapReferencePointsModal({
	store,
	storeMap,
	onClose,
}: StoreMapReferencePointsModalProps) {
	const [activePointIndex, setActivePointIndex] = useState(0);
	const saveReferencePoints = useSaveStoreMapReferencePointsMutation();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<ReferencePointFormInputs, undefined, ReferencePointFields>({
		resolver: zodResolver(referencePointsSchema),
		defaultValues: {
			referencePoints: storeMap.referencePoints ?? emptyReferencePoints,
		},
	});
	const referencePoints = watch("referencePoints");
	const mapPoints = referencePoints.map(toMapPosition);

	function selectMapPoint(position: StoreMapPosition) {
		setValue(`referencePoints.${activePointIndex}.x`, position.x, { shouldDirty: true });
		setValue(`referencePoints.${activePointIndex}.y`, position.y, { shouldDirty: true });
		setActivePointIndex((index) => Math.min(index + 1, 3));
	}

	async function save({ referencePoints: points }: ReferencePointFields) {
		try {
			await saveReferencePoints.mutateAsync({ storeMap, referencePoints: points });
			toast.success("Pontos de referência salvos com sucesso.");
			onClose();
		} catch (error) {
			console.error(error);
			toast.error("Não foi possível salvar os pontos de referência.");
		}
	}

	return (
		<Modal
			title="Pontos de referência"
			description="Selecione os quatro pontos no mapa e informe a latitude e longitude correspondentes."
			closeLabel="Fechar pontos de referência"
			onClose={onClose}
			size="lg"
			layout="scrollable"
		>
			<form onSubmit={handleSubmit(save)} className="mt-6" noValidate>
				<InteractiveStoreMap
					storeMapUrl={storeMap.imageUrl}
					storeName={store.name}
					referencePoints={mapPoints}
					onPositionSelect={selectMapPoint}
				/>
				<p className="mt-3 text-sm text-muted">
					Clique no mapa para posicionar o ponto {activePointIndex + 1}.
				</p>
				<div className="mt-5 grid gap-3 sm:grid-cols-2">
					{referencePoints.map((point, index) => (
						<section key={index} className="rounded-[var(--radius-card)] border border-border p-3">
							<button
								type="button"
								onClick={() => setActivePointIndex(index)}
								className={`inline-flex items-center gap-2 text-sm font-bold ${activePointIndex === index ? "text-primary" : "text-foreground"}`}
							>
								<Crosshair aria-hidden="true" className="size-4" />
								Ponto {index + 1}
							</button>
							<p className="mt-1 text-xs text-muted">
								{toMapPosition(point) ? `Mapa: X ${point.x}% · Y ${point.y}%` : "Clique no mapa para definir a posição."}
							</p>
							<div className="mt-3 grid grid-cols-2 gap-3">
								<FormField label="Latitude" inputId={`reference-latitude-${index}`} error={errors.referencePoints?.[index]?.latitude?.message}>
									<input {...register(`referencePoints.${index}.latitude`, { valueAsNumber: true })} id={`reference-latitude-${index}`} type="number" step="any" className={formControlClass({ hasError: Boolean(errors.referencePoints?.[index]?.latitude) })} />
								</FormField>
								<FormField label="Longitude" inputId={`reference-longitude-${index}`} error={errors.referencePoints?.[index]?.longitude?.message}>
									<input {...register(`referencePoints.${index}.longitude`, { valueAsNumber: true })} id={`reference-longitude-${index}`} type="number" step="any" className={formControlClass({ hasError: Boolean(errors.referencePoints?.[index]?.longitude) })} />
								</FormField>
							</div>
						</section>
					))}
				</div>
				<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
					<Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
					<Button type="submit" disabled={!isDirty || saveReferencePoints.isPending}>
						<Save aria-hidden="true" className="size-5" /> Salvar pontos
					</Button>
				</div>
			</form>
		</Modal>
	);
}
