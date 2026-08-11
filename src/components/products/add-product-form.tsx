"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ProductFormFields } from "@/components/products/product-form-fields";
import { Button } from "@/components/ui/button";
import {
	type ProductCategory,
	productCategories,
} from "@/constants/product-categories";
import { toBrl } from "@/lib/currency";
import {
	type ProductPlaceholderFields,
	productPlaceholderSchema,
} from "@/schemas/product";
import { useProductStore } from "@/store/product-store";

const defaultValues: ProductPlaceholderFields = {
	code: "",
	name: "",
	categoryId: "",
	regularPrice: "",
	pixPrice: "",
	installmentCount: "",
	installmentValue: "",
	imageUrl: "",
	thumbnailUrl: "",
};

function productPriceConditions(fields: ProductPlaceholderFields) {
	const lines = [`${toBrl(fields.regularPrice)} cada`];
	if (fields.pixPrice)
		lines.push(`${toBrl(fields.pixPrice)} cada`, "à vista no pix");
	if (fields.installmentCount && fields.installmentValue) {
		lines.push(
			`Parcelas: ${toBrl(fields.regularPrice)} em até ${fields.installmentCount}x de ${toBrl(fields.installmentValue)} s/juros`,
		);
	}
	return lines;
}

export function AddProductForm() {
	const addProduct = useProductStore((state) => state.addProduct);
	const [notice, setNotice] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductPlaceholderFields>({
		resolver: zodResolver(productPlaceholderSchema),
		defaultValues,
		reValidateMode: "onChange",
	});

	function submitProduct(fields: ProductPlaceholderFields) {
		const category = productCategories.find(
			(item) => item.id === fields.categoryId,
		) as ProductCategory | undefined;
		if (!category) return;

		addProduct({
			id: crypto.randomUUID(),
			codigo: fields.code.trim(),
			nome: fields.name.trim(),
			categoria: category,
			precos_e_condicoes: productPriceConditions(fields),
			imagem: fields.imageUrl || null,
			imagem_thumb: fields.thumbnailUrl || null,
		});
		reset(defaultValues);
		setNotice("Produto placeholder adicionado à lista local.");
	}

	return (
		<section aria-labelledby="add-product-title">
			<div className="mb-8 flex flex-col gap-1">
				<p className="text-sm font-semibold text-primary">Catálogo</p>
				<h2
					id="add-product-title"
					className="text-3xl font-bold tracking-tight"
				>
					Adicionar produto
				</h2>
				<p className="max-w-3xl text-sm leading-6 text-muted">
					Crie um produto de catálogo.
				</p>
			</div>

			<form
				onSubmit={handleSubmit(submitProduct)}
				noValidate
				className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-sm sm:p-7"
			>
				<ProductFormFields register={register} errors={errors} />
				<div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p aria-live="polite" className="text-sm font-medium text-primary">
						{notice}
					</p>
					<Button type="submit">
						<PackagePlus aria-hidden="true" className="size-5" />
						Adicionar produto
					</Button>
				</div>
			</form>
		</section>
	);
}
