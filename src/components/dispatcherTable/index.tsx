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
	Pagination,
	Selection,
} from "@nextui-org/react";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@nextui-org/react";

import { ColumnKeys, columns } from "./data";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dispatcher, Driver, DriverStatus } from "@/utils/types";

const statusColorMap: Record<DriverStatus, "success" | "danger"> = {
	[DriverStatus.Active]: "success",
	[DriverStatus.Inactive]: "danger",
};

interface DispatcherTableProps {
	rows: Dispatcher[];
	onMultipleSelect?: (selected: Dispatcher[]) => void;
}

export default function DispatcherTable({ rows }: DispatcherTableProps) {
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
	const [page, setPage] = React.useState(1);
	const rowsPerPage = 6;

	const pages = Math.ceil(rows.length / rowsPerPage);

	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return rows.slice(start, end);
	}, [page, rows]);

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
							<span>{dispatcher.firstName} </span>
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
								<DropdownItem>Edit</DropdownItem>
								<DropdownItem>Delete</DropdownItem>
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
			<div className="flex justify-start min-h-10 mb-4">
				{/* {new Set(selectedKeys).size > 0 && (
					<Button
						color="primary"
						onClick={() => {
							const selectedDrivers = Array.from(selectedKeys).map((key) => (
								<p>{key}</p>
							));
							console.log(selectedDrivers);
						}}
					>
						Modify Restrictions
					</Button>
				)} */}
			</div>

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
				<TableBody items={items}>
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
