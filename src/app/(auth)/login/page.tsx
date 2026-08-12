"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, inputBorderClass } from "@/components/ui/form-field";
import { useLoginMutation } from "@/hooks/use-auth-mutations";
import { useTheme } from "@/hooks/use-theme";
import { type LoginFields, loginSchema } from "@/schemas/auth";

export default function Home() {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const router = useRouter();
	const { mode: theme, toggle: toggleTheme } = useTheme();
	const login = useLoginMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFields>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
		reValidateMode: "onChange",
	});

	async function submitLogin(fields: LoginFields) {
		try {
			await login.mutateAsync(fields);
			router.replace("/products");
		} catch {
			toast.error("Não foi possível entrar. Tente novamente.");
		}
	}

	return (
		<main
			data-theme={theme}
			className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12"
		>
			<section
				className="w-full max-w-md rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-sm sm:p-10"
				aria-labelledby="login-title"
			>
				<div className="mb-8 flex justify-end">
					<Button
						variant="outline"
						size="icon"
						onClick={toggleTheme}
						className="text-muted hover:text-foreground"
						aria-label={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}
					>
						{theme === "dark" ? (
							<Sun aria-hidden="true" className="size-5" />
						) : (
							<Moon aria-hidden="true" className="size-5" />
						)}
					</Button>
				</div>

				<div className="mb-8 text-center">
					<Image
						src="/leroy-merlin-logo.png"
						alt="Leroy Merlin"
						width={88}
						height={88}
						className="mx-auto mb-6 rounded-xl object-contain"
						priority
					/>
					<h1
						id="login-title"
						className="text-3xl font-bold leading-9 tracking-tight text-foreground"
					>
						Entrar na Leroy Merlin
					</h1>
					<p className="mt-2 text-[15px] leading-6 text-muted">
						Use seu e-mail cadastrado para continuar
					</p>
				</div>

				<form
					onSubmit={handleSubmit(submitLogin)}
					noValidate
					className="space-y-4"
				>
					<FormField
						label="E-mail"
						inputId="email"
						error={errors.email?.message}
						errorId="email-error"
					>
						<div
							className={`flex h-[var(--control-height-input)] items-center rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-muted focus-within:border-primary ${inputBorderClass(Boolean(errors.email))}`}
						>
							<Mail aria-hidden="true" className="size-5" />
							<input
								id="email"
								type="email"
								placeholder="seu@email.com"
								autoComplete="email"
								aria-invalid={Boolean(errors.email)}
								aria-describedby={errors.email ? "email-error" : undefined}
								className="min-w-0 flex-1 bg-transparent px-2.5 text-[15px] text-foreground outline-none placeholder:text-placeholder"
								{...register("email")}
							/>
						</div>
					</FormField>

					<FormField
						label="Senha"
						inputId="password"
						error={errors.password?.message}
						errorId="password-error"
					>
						<div
							className={`flex h-[var(--control-height-input)] items-center rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-muted focus-within:border-primary ${inputBorderClass(Boolean(errors.password))}`}
						>
							<Lock aria-hidden="true" className="size-5" />
							<input
								id="password"
								type={passwordVisible ? "text" : "password"}
								placeholder="Sua senha"
								autoComplete="current-password"
								aria-invalid={Boolean(errors.password)}
								aria-describedby={
									errors.password ? "password-error" : undefined
								}
								className="min-w-0 flex-1 bg-transparent px-2.5 text-[15px] text-foreground outline-none placeholder:text-placeholder"
								{...register("password")}
							/>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setPasswordVisible((visible) => !visible)}
								aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
							>
								{passwordVisible ? (
									<Eye aria-hidden="true" className="size-5" />
								) : (
									<EyeOff aria-hidden="true" className="size-5" />
								)}
							</Button>
						</div>
					</FormField>

					<Button
						type="submit"
						className="mt-3 w-full"
						disabled={login.isPending}
					>
						Entrar
					</Button>
				</form>
			</section>
		</main>
	);
}
