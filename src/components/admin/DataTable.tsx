import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface Filter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: Filter[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  onExport?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  rowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedRows?: string[];
  onSelectRow?: (id: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  data,
  columns,
  filters,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  onAdd,
  addLabel = "Add New",
  onExport,
  onRefresh,
  isLoading,
  emptyState,
  rowKey,
  onRowClick,
  selectedRows,
  onSelectRow,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          {onSearchChange && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 rounded-xl border-border bg-background"
              />
            </div>
          )}

          {/* Filters */}
          {filters && filters.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className="w-[140px] rounded-xl">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-popover">
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 ml-auto">
            {onRefresh && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRefresh} 
                className="rounded-xl"
                disabled={isLoading}
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="icon" onClick={onExport} className="rounded-xl">
                <Download className="w-4 h-4" />
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} className="rounded-xl gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{addLabel}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {onSelectRow && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    onChange={() => {}}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="px-4 py-12 text-center">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="px-4 py-12 text-center">
                  {emptyState || (
                    <div className="text-muted-foreground">
                      <p className="font-medium">No data found</p>
                      <p className="text-sm">Try adjusting your filters or add new items.</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = rowKey(item);
                const isSelected = selectedRows?.includes(id);
                
                return (
                  <tr
                    key={id}
                    className={cn(
                      "transition-colors",
                      onRowClick && "cursor-pointer hover:bg-accent/50",
                      isSelected && "bg-primary/5"
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {onSelectRow && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow(id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-border"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm">
                        {column.render
                          ? column.render(item)
                          : (item as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-lg"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              className="rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
