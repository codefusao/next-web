"use client";
import GenericTable, { Column } from "@/components/table";

interface Product {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  status: "Ativo" | "Inativo";
}

export default function Products() {
  const listaProdutos: Product[] = [
    {
      id: 1,
      nome: "Teclado Mecânico RGB",
      preco: 349.9,
      estoque: 15,
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Mouse Sem Fio Ergonômico",
      preco: 199.0,
      estoque: 0,
      status: "Inativo",
    },
    {
      id: 3,
      nome: 'Monitor 24" IPS 144Hz',
      preco: 1199.99,
      estoque: 8,
      status: "Ativo",
    },
  ];

  const colunasProdutos: Column<Product>[] = [
    {
      header: "ID",
      key: "id",
      render: (prod) => (
        <span className="text-slate-400 font-mono">#{prod.id}</span>
      ),
    },
    {
      header: "Nome do Produto",
      key: "nome",
      render: (prod) => (
        <span className="text-slate-900 font-semibold">{prod.nome}</span>
      ),
    },
    {
      header: "Preço",
      key: "preco",
      render: (prod) => (
        <span className="text-slate-700">
          R$ {prod.preco.toFixed(2).replace(".", ",")}
        </span>
      ),
    },
    {
      header: "Estoque",
      key: "estoque",
      render: (prod) => (
        <span
          className={`font-bold ${prod.estoque === 0 ? "text-rose-500" : "text-slate-700"}`}
        >
          {prod.estoque}{" "}
          <span className="text-xs font-normal text-slate-400 ml-1">un</span>
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (prod) => (
        /* Badges com design moderno "Dot + Pill" */
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
            prod.status === "Ativo"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${prod.status === "Ativo" ? "bg-emerald-500" : "bg-slate-400"}`}
          ></span>
          {prod.status}
        </span>
      ),
    },
    { header: "Ações", key: "actions" },
  ];

  const handleEditar = (produto: Product) => console.log("Editar:", produto);
  const handleExcluir = (produto: Product) => console.log("Excluir:", produto);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho do Dashboard Modernizado */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Produtos
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Gerencie o catálogo e o estoque das lojas em tempo real.
            </p>
          </div>
          <button className="bg-emerald-600 cursor-pointer text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold shadow-md shadow-emerald-200 text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Novo Produto
          </button>
        </div>

        <GenericTable<Product>
          idKey="id"
          columns={colunasProdutos}
          data={listaProdutos}
          onEdit={handleEditar}
          onDelete={handleExcluir}
        />
      </div>
    </div>
  );
}
