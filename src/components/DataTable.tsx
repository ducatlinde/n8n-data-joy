import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Plus } from "lucide-react";

interface DataTableProps {
  data: Record<string, any>[];
  onEdit: (row: Record<string, any>, index: number) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data, onEdit, onDelete, onAdd }) => {
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg border border-border">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Keine Daten verfügbar</p>
          <Button onClick={onAdd} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Ersten Eintrag hinzufügen
          </Button>
        </div>
      </div>
    );
  }

  const columns = Object.keys(data[0] || {});

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCellEdit = (rowIndex: number, column: string, currentValue: any) => {
    setEditingCell({ row: rowIndex, col: column });
    setEditValue(String(currentValue || ""));
  };

  const handleCellSave = (rowIndex: number, column: string) => {
    const updatedRow = { ...data[rowIndex], [column]: editValue };
    onEdit(updatedRow, rowIndex);
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = String(a[sortColumn] || "");
        const bVal = String(b[sortColumn] || "");
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, filter, sortColumn, sortDirection]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          placeholder="🔍 Daten durchsuchen..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm input-enhanced"
        />
        <div className="flex gap-2">
          <Button onClick={onAdd} className="btn-add">
            <Plus className="w-5 h-5 mr-2" />
            Neuer Eintrag
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border/50 rounded-xl bg-gradient-card shadow-card animate-fade-in">
        <table className="data-table">
          <thead>
            <tr className="bg-gradient-to-r from-primary/5 to-primary/10">
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-200 select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="capitalize font-semibold">{column.replace(/_/g, " ")}</span>
                    {sortColumn === column && (
                      <span className="text-primary font-bold text-lg">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-32 text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="group animate-slide-up" style={{ animationDelay: `${rowIndex * 50}ms` }}>
                {columns.map((column) => (
                  <td
                    key={column}
                    onClick={() => handleCellEdit(rowIndex, column, row[column])}
                    className="cursor-pointer hover:bg-primary/5 transition-all duration-200 relative group-hover:scale-[1.01]"
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === column ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleCellSave(rowIndex, column)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCellSave(rowIndex, column);
                          if (e.key === "Escape") handleCellCancel();
                        }}
                        autoFocus
                        className="w-full input-enhanced border-primary/50 shadow-md"
                      />
                    ) : (
                      <div className="relative">
                        <span className="block truncate max-w-[200px]" title={String(row[column] || "")}>
                          {String(row[column] || "")}
                        </span>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-primary rounded transition-opacity duration-200"></div>
                      </div>
                    )}
                  </td>
                ))}
                <td>
                  <div className="flex space-x-2 justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(row, rowIndex)}
                      className="hover:scale-110 transition-transform duration-200 hover:bg-primary/10 hover:border-primary/30"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(rowIndex)}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedAndFilteredData.length === 0 && filter && (
        <div className="text-center py-8 animate-fade-in">
          <p className="text-muted-foreground text-lg">
            Keine Ergebnisse für "{filter}" gefunden
          </p>
        </div>
      )}
    </div>
  );
};