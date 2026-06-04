// Definição da estrutura de uma coluna genérica
export interface Column<T> {
  header: string;
  key: keyof T | "actions";
  // Função opcional para renderizar o conteúdo de forma personalizada (ex: badges, ícones, datas formatadas)
  render?: (row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  idKey: keyof T; // Chave única para o atributo 'key' do React (ex: 'id')
}

export default function GenericTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  idKey,
}: GenericTableProps<T>) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border-2 border-neutral-300">
          {/* Cabeçalho com fundo translúcido e tipografia acentuada */}
          <thead className="bg-neutral-400/80 border-b border-neutral-200 backdrop-blur-sm">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-neutral-400 font-medium"
                >
                  Nenhum registro encontrado no momento.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[idKey])}
                  className="hover:bg-neutral-400/50 border-b border-neutral-100 last:border-transparent transition-all duration-200 group"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-neutral-700 whitespace-nowrap font-medium"
                    >
                      {column.render ? (
                        column.render(row)
                      ) : column.key === "actions" ? (
                        /* Ações transformadas em 'Pills' interativos */
                        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="inline-flex items-center cursor-pointer justify-center px-3 py-1.5 text-xs font-bold transition-colors rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                            >
                              Editar
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="inline-flex cursor-pointer items-center justify-center px-3 py-1.5 text-xs font-bold transition-colors rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-800">
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
