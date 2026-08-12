"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import {
	type StoreBannerFields,
	type StoreBannerFormInputs,
	storeBannerSchema,
} from "@/schemas/store";

type StoreBannerModalProps = {
	bannerUrl: string;
	onClose: () => void;
	onSave: (bannerUrl: string) => void;
};

export function StoreBannerModal({
	bannerUrl,
	onClose,
	onSave,
}: StoreBannerModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<StoreBannerFormInputs, undefined, StoreBannerFields>({
		resolver: zodResolver(storeBannerSchema),
		defaultValues: { bannerUrl },
		reValidateMode: "onChange",
	});

	function saveBanner({ bannerUrl: nextBannerUrl }: StoreBannerFields) {
		onSave(nextBannerUrl);
	}

	return (
		<Modal
			title="Alterar banner da loja"
			description="Informe a URL pública HTTPS da nova imagem."
			closeLabel="Fechar alteração de banner"
			onClose={onClose}
		>
			<form onSubmit={handleSubmit(saveBanner)} noValidate className="mt-7">
				<FormField
					label="URL do banner"
					inputId="store-banner-url-modal"
					error={errors.bannerUrl?.message}
				>
					<input
						{...register("bannerUrl")}
						id="store-banner-url-modal"
						type="url"
						placeholder="https://..."
						className={formControlClass({
							hasError: Boolean(errors.bannerUrl),
						})}
						aria-invalid={Boolean(errors.bannerUrl)}
					/>
				</FormField>
				<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" disabled={!isDirty}>
						<ImageUp aria-hidden="true" className="size-5" />
						Salvar banner
					</Button>
				</div>
			</form>
		</Modal>
	);
}
