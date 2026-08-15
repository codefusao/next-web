"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import {
	useSaveStoreMapMutation,
	useStoreMapQuery,
} from "@/hooks/use-store-map-query";
import {
	type StoreMapUrlFields,
	type StoreMapUrlFormInputs,
	storeMapUrlSchema,
} from "@/schemas/store-map";

type StoreMapUploadModalProps = {
	companyId: string;
	onClose: () => void;
};

export function StoreMapUploadModal({
	companyId,
	onClose,
}: StoreMapUploadModalProps) {
	const { data: storeMap = null } = useStoreMapQuery(companyId);
	const saveStoreMap = useSaveStoreMapMutation();
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<StoreMapUrlFormInputs, undefined, StoreMapUrlFields>({
		resolver: zodResolver(storeMapUrlSchema),
		values: { imageUrl: storeMap?.imageUrl ?? "" },
		reValidateMode: "onChange",
	});

	async function saveMap({ imageUrl }: StoreMapUrlFields) {
		try {
			await saveStoreMap.mutateAsync({ companyId, storeMap, imageUrl });
			onClose();
		} catch {
			toast.error("Não foi possível atualizar o mapa da loja.");
		}
	}

	return (
		<Modal
			title="Alterar mapa da loja"
			description="Informe a URL pública HTTPS da imagem do mapa interno."
			closeLabel="Fechar alteração de mapa"
			onClose={onClose}
		>
			<form onSubmit={handleSubmit(saveMap)} noValidate className="mt-7">
				<FormField
					label="URL do mapa interno"
					inputId="store-map-url-modal"
					error={errors.imageUrl?.message}
				>
					<input
						{...register("imageUrl")}
						id="store-map-url-modal"
						type="url"
						placeholder="https://..."
						className={formControlClass({
							hasError: Boolean(errors.imageUrl),
						})}
						aria-invalid={Boolean(errors.imageUrl)}
					/>
				</FormField>
				<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" disabled={!isDirty || saveStoreMap.isPending}>
						{isDirty ? (
							<Save aria-hidden="true" className="size-5" />
						) : (
							<ImageUp aria-hidden="true" className="size-5" />
						)}
						Salvar mapa
					</Button>
				</div>
			</form>
		</Modal>
	);
}
