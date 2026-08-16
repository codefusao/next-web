import { z } from "zod";
import { type Company, CompanyStatus, type StoreHours } from "@/types/company";

const storeHoursSchema = z.object({
	mondayToSaturday: z.string(),
	sundaysAndHolidays: z.string().optional(),
});

export const companySchema = z.object({
	id: z.uuid(),
	parentId: z.uuid().nullable(),
	name: z.string(),
	cnpj: z.string().length(14),
	description: z.string().nullable(),
	address: z.string().nullable(),
	bannerUrl: z.url().nullable(),
	status: z.enum(CompanyStatus).nullable(),
	manager: z.string().nullable(),
	phone: z.string().nullable(),
	email: z.email().nullable(),
	area: z.number().positive().nullable(),
	storeHours: storeHoursSchema.nullable(),
	latitude: z.number().min(-90).max(90).nullable(),
	longitude: z.number().min(-180).max(180).nullable(),
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

type CompanyProfileInput = {
	bannerUrl?: string;
	status?: CompanyStatus;
	manager?: string;
	phone?: string;
	email?: string;
	area?: number;
	storeHours?: StoreHours;
	latitude?: number;
	longitude?: number;
};

export type CreateCompanyInput = Omit<
	Company,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "parentId"
	| "description"
	| "address"
	| keyof CompanyProfileInput
> &
	CompanyProfileInput & {
		parentId?: string | null;
		description?: string | null;
		address: string;
	};

export type UpdateCompanyInput = Partial<CreateCompanyInput>;
