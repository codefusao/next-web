"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, inputBorderClass } from "@/components/ui/form-field";
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

const inputClass = (hasError: boolean) =>
	`w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 py-3 text-[15px] text-foreground outline-none transition-colors file:mr-3 file:cursor-pointer file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-primary focus:border-primary ${inputBorderClass(hasError)}`;

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
		<div
			className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 sm:p-8"
			role="presentation"
		>
			<section
				className="mx-auto w-full max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-xl sm:p-7"
				role="dialog"
				aria-modal="true"
				aria-labelledby="store-map-upload-title"
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2
							id="store-map-upload-title"
							className="text-2xl font-bold tracking-tight"
						>
							Alterar mapa da loja
						</h2>
						<p className="mt-1 text-sm leading-6 text-muted">
							Envie uma imagem PNG, JPEG ou WebP de até 5 MB.
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						aria-label="Fechar alteração de mapa"
					>
						<X aria-hidden="true" className="size-5" />
					</Button>
				</div>
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
							className={inputClass(Boolean(errors.storeMap))}
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
			</section>
		</div>
	);
}
