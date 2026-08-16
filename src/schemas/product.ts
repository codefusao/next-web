import { z } from "zod";

const moneyPattern = /^\d+(?:[,.]\d{1,2})?$/;
const optionalMoney = z
	.string()
	.trim()
	.refine(
		(value) => !value || moneyPattern.test(value),
		"Informe um valor válido",
	);

export const productPlaceholderSchema = z
	.object({
		name: z.string().trim().min(1, "Nome do produto é obrigatório"),
		categoryId: z.string().min(1, "Selecione uma categoria"),
		unit: z.string().trim().min(1, "Informe a unidade de medida"),
		regularPrice: z
			.string()
			.trim()
			.min(1, "Preço regular é obrigatório")
			.regex(moneyPattern, "Informe um valor válido"),
		pixPrice: optionalMoney,
		installmentCount: z
			.string()
			.trim()
			.refine(
				(value) => !value || /^[1-9]\d*$/.test(value),
				"Informe um número inteiro",
			),
		installmentValue: optionalMoney,
		image: z
			.string()
			.trim()
			.refine(
				(value) => !value || z.url().safeParse(value).success,
				"Informe uma URL válida",
			),
	})
	.superRefine((data, context) => {
		const hasInstallmentCount = Boolean(data.installmentCount);
		const hasInstallmentValue = Boolean(data.installmentValue);

		if (hasInstallmentCount && !hasInstallmentValue) {
			context.addIssue({
				code: "custom",
				path: ["installmentValue"],
				message: "Informe o valor da parcela",
			});
		}
		if (hasInstallmentValue && !hasInstallmentCount) {
			context.addIssue({
				code: "custom",
				path: ["installmentCount"],
				message: "Informe a quantidade de parcelas",
			});
		}
	});

export type ProductPlaceholderFields = z.infer<typeof productPlaceholderSchema>;
