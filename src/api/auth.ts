import type { LoginFields } from "@/schemas/auth";
import type { AdminUser } from "@/store/auth-store";

export async function login({ email }: LoginFields): Promise<AdminUser> {
	const normalizedEmail = email.trim().toLowerCase();
	return { email: normalizedEmail };
}
