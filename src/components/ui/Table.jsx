import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { Select, SelectItem } from "./Select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./DropDown";

export function DataTable({
	data,
	columns,
	loading,
	displayButtons = true,
	displayFilters = true,
	additionalFilters = ''
}) {
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({});
	const [rowSelection, setRowSelection] = React.useState({});

	// Get filterable columns (exclude action columns and columns with enableHiding: false)
	const filterableColumns = React.useMemo(() => {
		return columns
			.filter(column =>
				column.id !== "actions" &&
				column.filterable &&
				column.enableHiding !== false &&
				typeof column.accessorKey === "string"
			)
			.map(column => ({
				id: column.id || column.accessorKey,
				label: column.header?.toString() || column.accessorKey
			}));
	}, [columns]);

	// Initialize selectedColumn with the first filterable column's id
	const [selectedColumn, setSelectedColumn] = React.useState(undefined);

	React.useEffect(() => {
		if (filterableColumns.length > 0 && !selectedColumn) {
			setSelectedColumn(filterableColumns[0].id);
		}
	}, [filterableColumns, selectedColumn]);


	const table = useReactTable({
		data: data || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	// Don't render the filter section if there are no filterable columns
	if (filterableColumns.length === 0) {
		return (
			<div className="w-full">
				{/* Rest of the table without filter section */}
				{/* ... */}
			</div>
		);
	}
	console.log(selectedColumn);

	return (
		<div className="w-full">
			<div className="flex flex-row-reverse items-center gap-4 py-4">
				{(selectedColumn && displayFilters) && (
					<>
						{additionalFilters}
						<Select
							value={selectedColumn}
							onValueChange={setSelectedColumn}
							placeholder="Select column to filter"
							className="w-[180px] bg-[var(--accent)]"
						>
							{filterableColumns.map((column) => (
								<SelectItem key={column.id} value={column.id}>
									{column.label}
								</SelectItem>
							))}
						</Select>

						<div className="flex-1 relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={`Filter by ${filterableColumns.find(col => col.id === selectedColumn)?.label.toLowerCase() || 'column'}...`}
								value={selectedColumn ? (table?.getColumn(selectedColumn)?.getFilterValue() ?? "") : ""}
								onChange={(event) => {
									table?.getColumn(selectedColumn)?.setFilterValue(event?.target?.value);
								}}
								className="pl-8 w-full bg-[var(--accent)]"
							/>
						</div>
					</>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger
						title={'Columns'}
						icon={<ChevronDown className="w-4 h-4 opacity-50 ml-10" />}
					/>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-lg border overflow-hidden">
				<table className="w-full caption-bottom text-sm">
					<thead className="border-none">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted rounded-lg" key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										className="h-10 px-2 text-center align-middle font-semibold bg-[var(--accent)] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
										key={header.id}
									>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="[&_tr:last-child]:border-0">
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<tr
									className="border-b transition-colors hover:bg-[var(--accent)]/70 text-sm"
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<td className="p-2 align-middle text-center [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]" key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
								<td
									className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] h-24 text-center"
									colSpan={columns.length}
								>
									No results.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{
				displayButtons && (
					<div className="flex items-center justify-end space-x-2 py-4">
						<div className="flex items-center gap-3">
							<Button
								title={'Previous'}
								variant="outline"
								className="rounded-lg w-[70px]"
								textSize="text-xs"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							/>
							<Button
								title={'Next'}
								variant="outline"
								className="rounded-lg w-[70px]"
								textSize="text-xs"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							/>
						</div>
					</div>
				)
			}
		</div>
	);
}
