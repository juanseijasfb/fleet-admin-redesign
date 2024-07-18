import React from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	User,
	Chip,
	Tooltip,
	getKeyValue,
	Spinner,
	Pagination,
	type Selection,
} from "@nextui-org/react";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@nextui-org/react";

import { type ColumnKeys, columns } from "./data";
import { BsThreeDotsVertical } from "react-icons/bs";
import { type Dispatcher, Driver, DriverStatus } from "@/utils/types";

const statusColorMap: Record<DriverStatus, "success" | "danger"> = {
	[DriverStatus.Active]: "success",
	[DriverStatus.Inactive]: "danger",
};

interface DispatcherTableProps {
	rows: Dispatcher[];
	onMultipleSelect: (selected: Dispatcher[]) => void;
	isLoading: boolean;
}

export default function DispatcherTable({
	rows,
	onMultipleSelect,
	isLoading,
}: DispatcherTableProps) {
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
	const [page, setPage] = React.useState(1);
	const rowsPerPage = 6;

	const pages = Math.ceil(rows.length / rowsPerPage);

	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return rows.slice(start, end);
	}, [page, rows]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const renderCell = React.useCallback(
		(dispatcher: Dispatcher, columnKey: ColumnKeys) => {
			const cellValue = dispatcher[columnKey as keyof Dispatcher];

			switch (columnKey) {
				case "status":
					return (
						<Chip
							className="capitalize"
							color={statusColorMap[dispatcher.status]}
							size="sm"
							variant="flat"
						>
							{cellValue}
						</Chip>
					);
				case "name":
					return (
						<span>
							<span>
								{dispatcher.firstName}
								{"   "}
							</span>
							<span>{dispatcher.lastName}</span>
						</span>
					);

				case "role":
					return (
						<div className="flex flex-col">
							<p className="text-bold text-sm capitalize">
								{cellValue === "A" ? "Admin" : "Dispatcher"}
							</p>
						</div>
					);
				case "actions":
					return (
						<Dropdown>
							<DropdownTrigger>
								<Button variant="light">
									<BsThreeDotsVertical size={20} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem onClick={() => onMultipleSelect([dispatcher])}>
									Assign driver
								</DropdownItem>
								{/* <DropdownItem>Edit</DropdownItem>
								<DropdownItem>Delete</DropdownItem> */}
							</DropdownMenu>
						</Dropdown>
					);
				default:
					return cellValue;
			}
		},
		[],
	);

	return (
		<div>
			<Table
				aria-label="Example table with custom cells"
				bottomContent={
					<div className="flex w-full justify-center">
						<Pagination
							isCompact
							showControls
							showShadow
							color="primary"
							page={page}
							total={pages}
							onChange={(page) => setPage(page)}
						/>
					</div>
				}
			>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === "actions" ? "center" : "start"}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					loadingState={isLoading ? "loading" : "idle"}
					loadingContent={<Spinner size="sm" color="primary" />}
					items={items}
				>
					{(item) => (
						<TableRow key={item.id}>
							{(columnKey) => (
								<TableCell>
									{renderCell(item, columnKey as ColumnKeys)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
