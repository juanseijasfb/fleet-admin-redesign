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
	Spinner,
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
import { type Driver, DriverStatus } from "@/utils/types";

const statusColorMap: Record<DriverStatus, "success" | "danger"> = {
	[DriverStatus.Active]: "success",
	[DriverStatus.Inactive]: "danger",
};

interface DriverTableProps {
	rows: Driver[];
	onMultipleSelect: (selectedDriver: Driver[], optionSelect: string) => void;
	isLoading?: boolean;
}

export default function DriverTable({
	rows,
	onMultipleSelect,
	isLoading,
}: DriverTableProps) {
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
		(driver: Driver, columnKey: ColumnKeys) => {
			const cellValue = driver[columnKey as keyof Driver];

			switch (columnKey) {
				case "status":
					return (
						<Chip
							className="capitalize"
							color={statusColorMap[driver.status]}
							size="sm"
							variant="flat"
						>
							{cellValue}
						</Chip>
					);
				case "carrier":
					return (
						<span className="w-32 whitespace-nowrap">
							<span>
								({driver.mcNumber}) <br /> {cellValue}
							</span>
						</span>
					);
				case "weight":
					return <span>{cellValue} lbs</span>;

				case "actions":
					return (
						<Dropdown>
							<DropdownTrigger>
								<Button variant="light">
									<BsThreeDotsVertical size={20} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem
									onClick={() => onMultipleSelect([driver], "showRestrictions")}
								>
									Show restriccions
								</DropdownItem>
								<DropdownItem
									onClick={() => onMultipleSelect([driver], "disable")}
								>
									Disable
								</DropdownItem>
								<DropdownItem
									onClick={() => onMultipleSelect([driver], "enable")}
								>
									Enable
								</DropdownItem>
								<DropdownItem
									onClick={() => onMultipleSelect([driver], "edit")}
								>
									Edit
								</DropdownItem>
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
					loadingContent={<Spinner />}
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
