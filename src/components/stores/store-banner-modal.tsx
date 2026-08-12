"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, inputBorderClass } from "@/components/ui/form-field";
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

const inputClass = (hasError: boolean) =>
	`h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary ${inputBorderClass(hasError)}`;

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
		<div
			className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 sm:p-8"
			role="presentation"
		>
			<section
				className="mx-auto w-full max-w-xl rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-xl sm:p-7"
				role="dialog"
				aria-modal="true"
				aria-labelledby="store-banner-title"
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2
							id="store-banner-title"
							className="text-2xl font-bold tracking-tight"
						>
							Alterar banner da loja
						</h2>
						<p className="mt-1 text-sm leading-6 text-muted">
							Informe a URL pública HTTPS da nova imagem.
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						aria-label="Fechar alteração de banner"
					>
						<X aria-hidden="true" className="size-5" />
					</Button>
				</div>
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
							className={inputClass(Boolean(errors.bannerUrl))}
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
			</section>
		</div>
	);
}
