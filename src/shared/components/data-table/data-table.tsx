import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Search, Inbox, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { DataTablePagination } from "./data-table-pagination";
import clsx from "clsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  placeholder?: string;
  tableName?: string;
  tableDescription?: string;
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const ROW_HEIGHT = 64;

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  placeholder = "Search......",
  tableName,
  tableDescription,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter as FilterFn<TData>,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter as FilterFn<TData>,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  const MemoizedTableRow = React.useMemo(() => {
    return React.memo(function TableRowMemo({ row }: { row: Row<TData> }) {
      return (
        <TableRow
          data-state={row.getIsSelected() && "selected"}
          className="hover:bg-muted/30 transition-colors data-[state=selected]:bg-muted/50 border-border/60"
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id} className="py-4 px-6">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      );
    });
  }, []);

  return (
    <Card
      className={clsx(
        "w-full overflow-hidden bg-background shadow-sm border-border/60",
        className,
      )}
    >
      <div className="flex flex-col gap-4 px-6 py-4 border-b border-border/60 bg-muted/20 md:flex-row md:items-center md:justify-between">
        {(tableName || tableDescription) && (
          <div className="flex flex-col gap-0.5">
            {tableName && (
              <h3 className="text-lg font-semibold tracking-tight">
                {tableName}
              </h3>
            )}
            {tableDescription && (
              <p className="text-sm text-muted-foreground">
                {tableDescription}
              </p>
            )}
          </div>
        )}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9 bg-background/50 focus:bg-background h-9 border-border/60"
          />
        </div>
      </div>

      <div ref={tableContainerRef} className="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader className="bg-muted/40 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-border/60"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={clsx(
                        "h-12 px-6 text-xs font-bold uppercase tracking-wider text-black/80 bg-muted/40",
                        canSort &&
                          "cursor-pointer select-none hover:bg-muted/60",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canSort &&
                            (sorted === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5 text-foreground" />
                            ) : sorted === "desc" ? (
                              <ArrowDown className="h-3.5 w-3.5 text-foreground" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                            ))}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              <>
                {paddingTop > 0 && (
                  <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return <MemoizedTableRow key={row.id} row={row} />;
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                  </tr>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-96 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">No results found</p>
                    <p className="text-xs text-muted-foreground/80 max-w-[12rem]">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-border/60 bg-muted/20 p-4 px-6">
        <DataTablePagination table={table} />
      </div>
    </Card>
  );
}
