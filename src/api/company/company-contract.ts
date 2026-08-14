import { z } from "zod";
import type { Company, CompanyListItem } from "@/types/company";

export const companySchema = z.object({
	id: z.uuid(),
	parentId: z.uuid().nullable(),
	name: z.string(),
	cnpj: z.string(),
	description: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const companiesResponseSchema = z.object({
	companies: z.array(companySchema),
	meta: z.object({
		totalPages: z.number().int().nonnegative(),
		currentPage: z.number().int().positive(),
		totalRecords: z.number().int().nonnegative(),
	}),
});

export type CreateCompanyInput = {
	parentId?: Company["parentId"];
	name: Company["name"];
	cnpj: Company["cnpj"];
	description?: Company["description"];
};

export type UpdateCompanyInput = Partial<
	Omit<CompanyListItem, "id" | "createdAt" | "updatedAt">
>;
