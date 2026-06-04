import React, { useState, useMemo } from "react";

export interface Column<T> {
  header: string;
  key: keyof T | "actions";
  render?: (row: T) => React.ReactNode;
  sortable?: boolean; // Nova propriedade para habilitar ordenação
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  idKey: keyof T;
  searchable?: boolean; // Habilita a barra de pesquisa
  searchPlaceholder?: string;
}

export default function GenericTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  idKey,
  searchable = true,
  searchPlaceholder = "Pesquisar...",
}: GenericTableProps<T>) {
  // Estados de Filtro e Ordenação
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  // Função para alternar a ordenação
  const handleSort = (key: keyof T | "actions", sortable?: boolean) => {
    if (key === "actions" || !sortable) return;

    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key: key as keyof T, direction });
  };

  // Processamento de Dados: Filtro e depois Ordenação
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Aplicar Filtro (Pesquisa Global)
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter((item) => {
        // Verifica se algum dos valores do objeto inclui o termo pesquisado
        return Object.values(item as Record<string, unknown>).some((val) =>
          String(val).toLowerCase().includes(lowercasedTerm),
        );
      });
    }

    // 2. Aplicar Ordenação
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
      {/* Barra de Filtro / Pesquisa */}
      {searchable && (
        <div className="p-4 border-b border-slate-100 bg-white/50">
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 sm:text-sm transition-colors"
            />
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200 backdrop-blur-sm">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  onClick={() => handleSort(column.key, column.sortable)}
                  className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest ${
                    column.sortable
                      ? "cursor-pointer hover:bg-slate-200/50 transition-colors group"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.header}

                    {/* Ícones de Ordenação Dinâmicos */}
                    {column.sortable && (
                      <span className="flex flex-col text-slate-300 group-hover:text-slate-500">
                        <svg
                          className={`w-3 h-3 -mb-1 ${sortConfig?.key === column.key && sortConfig.direction === "asc" ? "text-indigo-600" : ""}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <svg
                          className={`w-3 h-3 ${sortConfig?.key === column.key && sortConfig.direction === "desc" ? "text-indigo-600" : ""}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-slate-400 font-medium"
                >
                  {searchTerm
                    ? "Nenhum resultado para a sua pesquisa."
                    : "Nenhum registro encontrado."}
                </td>
              </tr>
            ) : (
              processedData.map((row) => (
                <tr
                  key={String(row[idKey])}
                  className="hover:bg-slate-50/80 border-b border-slate-100 last:border-transparent transition-all duration-200 group"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap font-medium"
                    >
                      {/* Lógica de renderização original mantida */}
                      {column.render ? (
                        column.render(row)
                      ) : column.key === "actions" ? (
                        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold transition-colors rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                            >
                              Editar
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold transition-colors rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-800">
                          {String(row[column.key as keyof T] ?? "")}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
