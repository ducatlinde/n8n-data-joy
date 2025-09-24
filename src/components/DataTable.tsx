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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Daten filtern..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={onAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Hinzufügen
        </Button>
      </div>

      <div className="overflow-auto border border-border rounded-lg bg-card">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span className="capitalize">{column}</span>
                    {sortColumn === column && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-20">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={column}
                    onClick={() => handleCellEdit(rowIndex, column, row[column])}
                    className="cursor-pointer hover:bg-table-row-hover transition-colors"
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
                        className="w-full"
                      />
                    ) : (
                      <span>{String(row[column] || "")}</span>
                    )}
                  </td>
                ))}
                <td>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(row, rowIndex)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(rowIndex)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};