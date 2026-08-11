import { ImageIcon, PackagePlus } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField, inputBorderClass } from "@/components/ui/form-field";
import { productCategories } from "@/constants/product-categories";
import type { ProductPlaceholderFields } from "@/schemas/product";

type ProductFormFieldsProps = {
	register: UseFormRegister<ProductPlaceholderFields>;
	errors: FieldErrors<ProductPlaceholderFields>;
};

function inputClass(hasError: boolean) {
	return `h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary ${inputBorderClass(hasError)}`;
}

export function ProductFormFields({
	register,
	errors,
}: ProductFormFieldsProps) {
	return (
		<>
			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					label="Código do produto"
					inputId="product-code"
					error={errors.code?.message}
				>
					<input
						{...register("code")}
						id="product-code"
						placeholder="Ex.: 1571698172"
						className={inputClass(Boolean(errors.code))}
						aria-invalid={Boolean(errors.code)}
					/>
				</FormField>
				<FormField
					label="Nome do produto"
					inputId="product-name"
					error={errors.name?.message}
				>
					<input
						{...register("name")}
						id="product-name"
						placeholder="Ex.: Garrafa térmica 2 L"
						className={inputClass(Boolean(errors.name))}
						aria-invalid={Boolean(errors.name)}
					/>
				</FormField>
				<FormField
					label="Categoria"
					inputId="product-category"
					error={errors.categoryId?.message}
				>
					<select
						{...register("categoryId")}
						id="product-category"
						className={inputClass(Boolean(errors.categoryId))}
						aria-invalid={Boolean(errors.categoryId)}
					>
						<option value="">Selecione uma categoria</option>
						{productCategories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.label}
							</option>
						))}
					</select>
				</FormField>
				<FormField
					label="Preço regular"
					inputId="product-regular-price"
					error={errors.regularPrice?.message}
					hint="Use vírgula ou ponto decimal."
				>
					<input
						{...register("regularPrice")}
						id="product-regular-price"
						inputMode="decimal"
						placeholder="39,90"
						className={inputClass(Boolean(errors.regularPrice))}
						aria-invalid={Boolean(errors.regularPrice)}
					/>
				</FormField>
			</div>

			<div className="my-7 border-t border-border" />
			<div className="mb-4 flex items-center gap-2">
				<span className="rounded-lg bg-primary/10 p-2 text-primary">
					<PackagePlus aria-hidden="true" className="size-4" />
				</span>
				<div>
					<h3 className="font-bold">Condições de preço</h3>
					<p className="text-sm text-muted">
						Pix e parcelamento são opcionais.
					</p>
				</div>
			</div>
			<div className="grid gap-5 md:grid-cols-3">
				<FormField
					label="Preço no Pix"
					inputId="product-pix-price"
					error={errors.pixPrice?.message}
				>
					<input
						{...register("pixPrice")}
						id="product-pix-price"
						inputMode="decimal"
						placeholder="34,90"
						className={inputClass(Boolean(errors.pixPrice))}
						aria-invalid={Boolean(errors.pixPrice)}
					/>
				</FormField>
				<FormField
					label="Quantidade de parcelas"
					inputId="product-installment-count"
					error={errors.installmentCount?.message}
				>
					<input
						{...register("installmentCount")}
						id="product-installment-count"
						inputMode="numeric"
						placeholder="3"
						className={inputClass(Boolean(errors.installmentCount))}
						aria-invalid={Boolean(errors.installmentCount)}
					/>
				</FormField>
				<FormField
					label="Valor da parcela"
					inputId="product-installment-value"
					error={errors.installmentValue?.message}
				>
					<input
						{...register("installmentValue")}
						id="product-installment-value"
						inputMode="decimal"
						placeholder="13,30"
						className={inputClass(Boolean(errors.installmentValue))}
						aria-invalid={Boolean(errors.installmentValue)}
					/>
				</FormField>
			</div>

			<div className="my-7 border-t border-border" />
			<div className="mb-4 flex items-center gap-2">
				<span className="rounded-lg bg-primary/10 p-2 text-primary">
					<ImageIcon aria-hidden="true" className="size-4" />
				</span>
				<div>
					<h3 className="font-bold">Imagens</h3>
					<p className="text-sm text-muted">
						Opcional. Use URLs públicas para a imagem principal e miniatura.
					</p>
				</div>
			</div>
			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					label="URL da imagem principal"
					inputId="product-image-url"
					error={errors.imageUrl?.message}
				>
					<input
						{...register("imageUrl")}
						id="product-image-url"
						type="url"
						placeholder="https://..."
						className={inputClass(Boolean(errors.imageUrl))}
						aria-invalid={Boolean(errors.imageUrl)}
					/>
				</FormField>
				<FormField
					label="URL da miniatura"
					inputId="product-thumbnail-url"
					error={errors.thumbnailUrl?.message}
				>
					<input
						{...register("thumbnailUrl")}
						id="product-thumbnail-url"
						type="url"
						placeholder="https://..."
						className={inputClass(Boolean(errors.thumbnailUrl))}
						aria-invalid={Boolean(errors.thumbnailUrl)}
					/>
				</FormField>
			</div>
		</>
	);
}
