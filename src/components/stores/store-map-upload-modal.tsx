"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import {
	type StoreMapUploadFields,
	type StoreMapUploadFormInputs,
	storeMapUploadSchema,
} from "@/schemas/store";

type StoreMapUploadModalProps = {
	onClose: () => void;
	onSave: (storeMapUrl: string) => void;
};

export function StoreMapUploadModal({
	onClose,
	onSave,
}: StoreMapUploadModalProps) {
	const [fileName, setFileName] = useState("");
	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isDirty, isSubmitting },
	} = useForm<StoreMapUploadFormInputs, undefined, StoreMapUploadFields>({
		resolver: zodResolver(storeMapUploadSchema),
		reValidateMode: "onChange",
	});
	const { ref, ...storeMapInput } = register("storeMap");

	async function saveMap({ storeMap }: StoreMapUploadFields) {
		const storeMapUrl = await readFileAsDataUrl(storeMap);
		onSave(storeMapUrl);
	}

	return (
		<Modal
			title="Alterar mapa da loja"
			description="Envie uma imagem PNG, JPEG ou WebP de até 5 MB."
			closeLabel="Fechar alteração de mapa"
			onClose={onClose}
		>
			<form onSubmit={handleSubmit(saveMap)} noValidate className="mt-7">
				<FormField
					label="Imagem do mapa interno"
					inputId="store-map-upload"
					error={errors.storeMap?.message}
					hint={fileName ? `Selecionado: ${fileName}` : undefined}
				>
					<input
						{...storeMapInput}
						ref={ref}
						id="store-map-upload"
						type="file"
						accept="image/png,image/jpeg,image/webp"
						className={formControlClass({
							kind: "file",
							hasError: Boolean(errors.storeMap),
						})}
						aria-invalid={Boolean(errors.storeMap)}
						onChange={(event) => {
							const file = event.target.files?.[0];
							setFileName(file?.name ?? "");
							if (file) {
								setValue("storeMap", file, {
									shouldDirty: true,
									shouldValidate: true,
								});
							}
						}}
					/>
				</FormField>
				<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" disabled={!isDirty || isSubmitting}>
						{isSubmitting ? (
							<ImageUp aria-hidden="true" className="size-5" />
						) : (
							<Save aria-hidden="true" className="size-5" />
						)}
						Salvar mapa
					</Button>
				</div>
			</form>
		</Modal>
	);
}
