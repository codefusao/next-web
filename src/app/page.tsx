"use client";

import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTheme } from "@/hooks/use-theme";
import { loginSchema, type LoginFields } from "@/schemas/auth";

export default function Home() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { mode: theme, toggle: toggleTheme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    reValidateMode: "onChange",
  });

  return (
    <main data-theme={theme} className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <section className="w-full max-w-md rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-sm sm:p-10" aria-labelledby="login-title">
        <div className="mb-8 flex justify-end">
          <button type="button" onClick={toggleTheme} className="cursor-pointer rounded-[var(--radius-control)] border border-border p-2 text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}>
            {theme === "dark" ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
          </button>
        </div>

        <div className="mb-8 text-center">
          <Image src="/leroy-merlin-logo.png" alt="Leroy Merlin" width={88} height={88} className="mx-auto mb-6 rounded-xl object-contain" priority />
          <h1 id="login-title" className="text-3xl font-bold leading-9 tracking-tight text-foreground">Entrar na Leroy Merlin</h1>
          <p className="mt-2 text-[15px] leading-6 text-muted">Use seu e-mail cadastrado para continuar</p>
        </div>

        <form onSubmit={handleSubmit(() => undefined)} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">E-mail</label>
            <div className={`flex h-[var(--control-height-input)] items-center rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-muted focus-within:border-primary ${errors.email ? "border-destructive" : "border-border"}`}>
              <Mail aria-hidden="true" className="size-5" />
              <input id="email" type="email" placeholder="seu@email.com" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="min-w-0 flex-1 bg-transparent px-2.5 text-[15px] text-foreground outline-none placeholder:text-placeholder" {...register("email")} />
            </div>
            {errors.email && <p id="email-error" className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-foreground">Senha</label>
            <div className={`flex h-[var(--control-height-input)] items-center rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-muted focus-within:border-primary ${errors.password ? "border-destructive" : "border-border"}`}>
              <Lock aria-hidden="true" className="size-5" />
              <input id="password" type={passwordVisible ? "text" : "password"} placeholder="Sua senha" autoComplete="current-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} className="min-w-0 flex-1 bg-transparent px-2.5 text-[15px] text-foreground outline-none placeholder:text-placeholder" {...register("password")} />
              <button type="button" onClick={() => setPasswordVisible((visible) => !visible)} className="cursor-pointer rounded p-1 text-muted transition-colors hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={passwordVisible ? "Ocultar senha" : "Mostrar senha"}>
                {passwordVisible ? <Eye aria-hidden="true" className="size-5" /> : <EyeOff aria-hidden="true" className="size-5" />}
              </button>
            </div>
            {errors.password && <p id="password-error" className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <button type="submit" className="mt-3 h-[var(--control-height-button)] w-full cursor-pointer rounded-[var(--radius-control)] bg-primary px-6 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Entrar</button>
        </form>
      </section>
    </main>
  );
}
