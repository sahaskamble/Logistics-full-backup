import React, { useMemo, useState } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import { Select, SelectItem } from './Select';

export default function MobileDataTable({
	data = [],
	columns,
	loading,
	displayButtons = true,
	displayFilters = true,
	additionalFilters = null,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [expandedRows, setExpandedRows] = useState({});
	const [rowSelection, setRowSelection] = useState({});

	// Extract filterable columns
	const filterableColumns = useMemo(() => {
		return columns
			.filter(
				(col) =>
					col.id !== 'actions' &&
					col.filterable &&
					col.enableHiding !== false &&
					typeof col.accessorKey === 'string'
			)
			.map((col) => ({
				id: col.id || col.accessorKey,
				label: col.header?.toString() || col.accessorKey,
			}));
	}, [columns]);

	const [selectedColumn, setSelectedColumn] = useState(
		filterableColumns.length > 0 ? filterableColumns[0].id : null
	);

	const table = useReactTable({
		data: data || [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const toggleExpand = (rowId) => {
		setExpandedRows((prev) => ({
			...prev,
			[rowId]: !prev[rowId],
		}));
	};

	// Find columns by accessorKey
	const statusColumn = columns.find((col) => col?.id === 'status');
	const idColumn = columns.find((col) => col?.id === 'id');

	if (loading) return <div className="p-4">Loading...</div>;

	return (
		<div className="w-full p-4 space-y-4">
			{/* Filters */}
			{displayFilters && filterableColumns.length > 0 && (
				<div className="grid gap-3 pb-6">
					{additionalFilters}

					<Select
						value={selectedColumn}
						onValueChange={setSelectedColumn}
						className="w-full text-sm"
						placeholder="Select column"
					>
						{filterableColumns.map((col) => (
							<SelectItem key={col.id} value={col.id}>
								{col.label}
							</SelectItem>
						))}
					</Select>

					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={`Search ...`}
							className="pl-8 w-full bg-accent"
							value={table.getColumn(selectedColumn)?.getFilterValue() ?? ''}
							onChange={(e) => {
								table.getColumn(selectedColumn)?.setFilterValue(e.target.value);
							}}
						/>
					</div>
				</div>
			)}

			{/* Table Rows */}
			<div className="space-y-4">
				{table?.getRowModel()?.rows?.length ? (
					table?.getRowModel()?.rows?.map((row, index) => {
						const visibleCells = row?.getVisibleCells();
						const mainCells = visibleCells.filter((cell) => cell?.column?.id !== statusColumn?.id && cell?.column?.id !== idColumn?.id).slice(0, 4);
						const extraCells = visibleCells.filter((cell) => cell?.column?.id !== statusColumn?.id && cell?.column?.id !== idColumn?.id).slice(4);
						const isExpanded = expandedRows[row.id];

						const statusCell = visibleCells.find((cell) => cell?.column?.id === statusColumn?.id);
						const idCell = visibleCells.find((cell) => cell?.column?.id === idColumn?.id);

						return (
							<div
								key={index}
								className="bg-accent p-3 rounded-lg border shadow-sm space-y-2"
								data-state={row?.getIsSelected() && 'selected'}
							>
								{/* Status */}
								<div className="text-xs flex pb-4">
									{statusCell && flexRender(statusCell?.column?.columnDef?.cell, statusCell?.getContext())}
								</div>

								{/* ID */}
								{
									idCell && (
										<div className="text-sm font-semibold text-primary flex pb-4">
											# {idCell && flexRender(idCell?.column?.columnDef?.cell, idCell?.getContext())}
										</div>
									)
								}

								{/* Main 4 Cells */}
								{mainCells.map((cell, index) => (
									<div key={index} className="text-sm flex items-center justify-between gap-4 border-b border-foreground/20 pb-2">
										<div className="font-medium text-muted-foreground">
											{cell?.column?.columnDef?.header?.toString()}
										</div>
										<div>{flexRender(cell?.column?.columnDef?.cell, cell?.getContext())}</div>
									</div>
								))}

								{/* Expandable cells */}
								{isExpanded && (
									<div className="pt-2 space-y-2">
										{extraCells.map((cell, index) => (
											<div key={index} className="text-sm flex items-center justify-between gap-4 border-b border-foreground/20 pb-2">
												<div className="font-medium text-muted-foreground">
													{cell?.column?.columnDef?.header?.toString()}
												</div>
												<div>{flexRender(cell?.column?.columnDef?.cell, cell?.getContext())}</div>
											</div>
										))}
									</div>
								)}

								{/* More / Less Button */}
								{extraCells?.length > 0 && (
									<div className="text-right pt-1">
										<Button
											className="rounded-md w-full"
											onClick={() => toggleExpand(row?.id)}
											title={isExpanded ? 'Less' : 'More'}
											icon={
												isExpanded ? (
													<ChevronUp className="w-4 h-4 ml-1" />
												) : (
													<ChevronDown className="w-4 h-4 ml-1" />
												)
											}
											iconPosition="right"
											textSize="text-sm"
										/>
									</div>
								)}
							</div>
						);
					})
				) : (
					<div className="text-center text-sm text-muted-foreground py-10">No results.</div>
				)}
			</div>

			{/* Pagination */}
			{displayButtons && (
				<div className="flex justify-center gap-4 pt-4">
					<Button
						title="Previous"
						variant="outline"
						textSize="text-xs"
						className="rounded-lg"
						onClick={() => table?.previousPage()}
						disabled={!table?.getCanPreviousPage()}
					/>
					<Button
						title="Next"
						variant="outline"
						textSize="text-xs"
						className="rounded-lg"
						onClick={() => table?.nextPage()}
						disabled={!table?.getCanNextPage()}
					/>
				</div>
			)}
		</div>
	);
}
