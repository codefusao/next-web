"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProductFormFields } from "@/components/products/forms/product-form-fields";
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

type AddProductFormProps = {
	onSuccess: () => void;
};

export function AddProductForm({ onSuccess }: AddProductFormProps) {
	const addProduct = useProductStore((state) => state.addProduct);
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
		toast.success("Produto adicionado com sucesso.");
		onSuccess();
	}

	return (
		<form onSubmit={handleSubmit(submitProduct)} noValidate className="mt-6">
			<ProductFormFields register={register} errors={errors} />
			<div className="mt-7 flex justify-end border-t border-border pt-6">
				<Button type="submit">
					<PackagePlus aria-hidden="true" className="size-5" />
					Adicionar produto
				</Button>
			</div>
		</form>
	);
}
