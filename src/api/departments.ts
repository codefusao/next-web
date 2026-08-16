import { z } from "zod";
import { apiRequest } from "@/api/client";

const departmentSchema = z.object({ id: z.string().uuid(), companyId: z.string().uuid(), name: z.string() });
const departmentsResponseSchema = z.object({
	departments: z.array(departmentSchema),
	meta: z.object({ totalPages: z.number(), currentPage: z.number(), totalRecords: z.number() }),
});

export type Department = z.infer<typeof departmentSchema>;

export async function getDepartments(companyId: string): Promise<Department[]> {
	const response = await apiRequest(
		`/department?page=1&limit=10&companyId=${companyId}`,
		departmentsResponseSchema,
	);
	return response.departments;
}

export function createDepartment(companyId: string, name: string) {
	return apiRequest("/department", departmentSchema, {
		method: "POST",
		body: { companyId, name },
	});
}
