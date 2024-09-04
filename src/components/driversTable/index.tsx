import React, { useEffect, useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Spinner,
	divider,
	Pagination,
	SortDescriptor,
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
import InfiniteScroll from "react-infinite-scroll-component";

const statusColorMap: Record<DriverStatus, "success" | "danger"> = {
	[DriverStatus.Active]: "success",
	[DriverStatus.Inactive]: "danger",
};

interface DriverTableProps {
	drivers: Driver[];
	onMultipleSelect: (selectedDriver: Driver[], optionSelect: string) => void;
	listDriversId: (id: number[]) => void;
	isLoading?: boolean;
	fetchNextPage: () => void,
	hasNextPage: boolean,
	showMultipleSelect: boolean
}

export default function DriverTable({
	drivers,
	onMultipleSelect,
	listDriversId,
	isLoading,
	fetchNextPage,
	hasNextPage,
	showMultipleSelect
}: DriverTableProps) {
	const [modeSelectionTable, setModeSelectionTable] = useState<boolean>(showMultipleSelect);
	const [selectionTable, setSelectionTable] = useState<string[]>([]);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});

	const sortedItems = React.useMemo(() => {
		return [...drivers].sort((a: Driver, b: Driver) => {
		  const first = a[sortDescriptor.column as keyof Driver] as number;
		  const second = b[sortDescriptor.column as keyof Driver] as number;
		  const cmp = first < second ? -1 : first > second ? 1 : 0;
	
		  return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, drivers]);

	const renderCell = React.useCallback(
		(driver: Driver, columnKey: ColumnKeys) => {
			const cellValue = driver[columnKey as keyof Driver];

			switch (columnKey) {
				case "firstName":
					const extractedFirstName = typeof cellValue === "string" ? cellValue.split(",")[1] || "" : "";
					return (
						<span className="w-32 whitespace-nowrap">
							{extractedFirstName}
						</span>
					)
				case "lastName":
				const extractedLastName = typeof cellValue === "string" ? cellValue.split(",")[0] || "" : "";
				return (
					<span className="w-32 whitespace-nowrap">
						{extractedLastName}
					</span>
				)
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
	const handlerSelectionChange = (e: any) => {
        const arrFromSet = [...e]
		e.size === 0 ? setSelectionTable([]) : setSelectionTable(arrFromSet);
    };
	
	useEffect(() => {
		setModeSelectionTable(showMultipleSelect)
	},[showMultipleSelect])

	useEffect(() => {
		listDriversId(selectionTable.map(str => parseInt(str)))
	},[selectionTable])

	return (
			<InfiniteScroll
				dataLength={drivers.length}
				next={() => setTimeout(fetchNextPage, 1000)}
				hasMore={hasNextPage}
				loader={
					<div className="flex justify-center py-10">
						<Spinner />
					</div>
				}
				style={{ paddingBottom: "10px" }}
			>
				<Table
					aria-label="Example table with custom cells"
					selectionMode={"multiple"}
					selectionBehavior={modeSelectionTable ? "toggle" : "replace"}
					onRowAction={() => setModeSelectionTable(!modeSelectionTable)}
					onSelectionChange={(e) => handlerSelectionChange(e)}
					sortDescriptor={sortDescriptor}
					onSortChange={setSortDescriptor}
				>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn
								key={column.uid}
								align={["actions", "equipment", "status"].includes(column.uid) ? "center" : "start"}
								allowsSorting={column.uid !== "equipment"}
							>
								{column.name}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						loadingState={isLoading ? "loading" : "idle"}
						loadingContent={<Spinner />}
						items={sortedItems}
					>
						{(item) => (
							<TableRow key={item.id} className="cursor-pointer">
								{(columnKey) => (
									<TableCell>
										{renderCell(item, columnKey as ColumnKeys)}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</InfiniteScroll>
	);
}
