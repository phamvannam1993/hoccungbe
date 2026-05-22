interface DataTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  emptyMessage?: string;
}

export default function DataTable({ headers, rows, emptyMessage = 'Không có dữ liệu' }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-10 text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, ri) => (
              <tr
                key={ri}
                className={`border-b border-gray-50 hover:bg-blue-50 transition-colors ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-gray-900">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
