import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AdminUser = {
	id: string;
	companyId: string | null;
	name: string;
	email: string;
	role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "CUSTOMER";
};

export enum AuthStatus {
	Loading = "loading",
	Authenticated = "authenticated",
	Unauthenticated = "unauthenticated",
}

interface AuthState {
	user: AdminUser | null;
	authStatus: AuthStatus;
	login: (user: AdminUser) => void;
	logout: () => void;
	setAuthStatus: (authStatus: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			authStatus: AuthStatus.Loading,
			login: (user) => set({ user, authStatus: AuthStatus.Authenticated }),
			logout: () => set({ user: null, authStatus: AuthStatus.Unauthenticated }),
			setAuthStatus: (authStatus) => set({ authStatus }),
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ user: state.user }),
			onRehydrateStorage: () => (state) =>
				state?.setAuthStatus(
					state.user ? AuthStatus.Authenticated : AuthStatus.Unauthenticated,
				),
		},
	),
);
