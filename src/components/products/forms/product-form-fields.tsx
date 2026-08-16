import { ImageIcon, PackagePlus } from "lucide-react";
import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField, formControlClass } from "@/components/ui/form-field";
import type { Category } from "@/api/categories";
import type { ProductPlaceholderFields } from "@/schemas/product";

type ProductFormFieldsProps = {
	register: UseFormRegister<ProductPlaceholderFields>;
	errors: FieldErrors<ProductPlaceholderFields>;
	categories: readonly Category[];
	categoryAction?: ReactNode;
};

function inputClass(hasError: boolean) {
	return formControlClass({ hasError });
}

export function ProductFormFields({
	register,
	errors,
	categories,
	categoryAction,
}: ProductFormFieldsProps) {
	return (
		<>
			<div className="grid gap-5 md:grid-cols-2">
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
					<div className="flex gap-2">
						<select
							{...register("categoryId")}
							id="product-category"
							className={`${inputClass(Boolean(errors.categoryId))} min-w-0 flex-1`}
							aria-invalid={Boolean(errors.categoryId)}
						>
							<option value="">Selecione uma categoria</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						{categoryAction}
					</div>
				</FormField>
				<FormField
					label="Unidade de medida"
					inputId="product-unit"
					error={errors.unit?.message}
				>
					<input
						{...register("unit")}
						id="product-unit"
						placeholder="Ex.: UN, M, KG"
						className={inputClass(Boolean(errors.unit))}
						aria-invalid={Boolean(errors.unit)}
					/>
				</FormField>
				<FormField
					label="Preço regular"
					inputId="product-regular-price"
					error={errors.regularPrice?.message}
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
						Opcional. Use uma URL pública para a imagem do produto.
					</p>
				</div>
			</div>
			<div>
				<FormField
					label="URL da imagem"
					inputId="product-image-url"
					error={errors.image?.message}
				>
					<input
						{...register("image")}
						id="product-image-url"
						type="url"
						placeholder="https://..."
						className={inputClass(Boolean(errors.image))}
						aria-invalid={Boolean(errors.image)}
					/>
				</FormField>
			</div>
		</>
	);
}
