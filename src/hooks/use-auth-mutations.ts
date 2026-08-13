"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import type { LoginFields } from "@/schemas/auth";
import { useAuthStore } from "@/store/auth-store";

export function useLoginMutation() {
	const setSession = useAuthStore((state) => state.login);

	return useMutation({
		mutationFn: (fields: LoginFields) => login(fields),
		onSuccess: (user) => setSession(user.email),
	});
}
