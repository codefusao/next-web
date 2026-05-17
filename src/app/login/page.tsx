import LoginForm from "@/components/login-form";

export default function Login() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Leroy Merlin</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Gestão Centralizada de Lojas, Funcionários e Produtos
        </p>
      </div>

      <LoginForm />
    </main>
  );
}
