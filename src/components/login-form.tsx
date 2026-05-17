"use client";

import { redirect } from "next/navigation";
import React, { useState } from "react";
import Input from "./input";

export default function BackofficeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Autenticação
    redirect("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md space-y-5"
      noValidate
    >
      {/* Campo de E-mail */}
      <Input
        label="E-mail"
        id="email"
        name="email"
        type="email"
        placeholder="nome@suaempresa.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Campo de Senha */}
      <Input
        label="Senha"
        id="password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Opções Extras */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700 cursor-pointer"
          >
            Lembrar-me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 cursor-pointer bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium shadow-sm"
      >
        Acessar Dashboard
      </button>
    </form>
  );
}
