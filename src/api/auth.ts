import { z } from "zod";
import { apiRequest } from "@/api/client";
import type { LoginFields } from "@/schemas/auth";

export const authenticatedUserSchema = z.object({
	id: z.uuid(),
	companyId: z.uuid().nullable(),
	name: z.string(),
	email: z.email(),
	role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER"]),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;

export function login(fields: LoginFields): Promise<AuthenticatedUser> {
	return apiRequest("/auth/login", authenticatedUserSchema, {
		method: "POST",
		body: fields,
	});
}

export function getCurrentSession(): Promise<AuthenticatedUser> {
	return apiRequest("/auth/me", authenticatedUserSchema);
}

export function logout(): Promise<{ message: string }> {
	return apiRequest("/auth/logout", z.object({ message: z.string() }), {
		method: "POST",
	});
}
