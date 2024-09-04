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
import { type Dispatcher, Driver, DriverStatus } from "@/utils/types";
import InfiniteScroll from "react-infinite-scroll-component";

const statusColorMap: Record<DriverStatus, "success" | "danger"> = {
	[DriverStatus.Active]: "success",
	[DriverStatus.Inactive]: "danger",
};

interface DispatcherTableProps {
	dispatchers: Dispatcher[];
	onMultipleSelect: (selected: Dispatcher[], optionSelect: string) => void;
	listDispatchersId: (id: number[]) => void;
	isLoading: boolean;
	fetchNextPage: () => void,
	hasNextPage: boolean,
	showMultipleSelect: boolean
}

export default function DispatcherTable({
	dispatchers,
	onMultipleSelect,
	listDispatchersId,
	isLoading,
	fetchNextPage,
	hasNextPage,
	showMultipleSelect,
}: DispatcherTableProps) {
	const [modeSelectionTable, setModeSelectionTable] = useState<boolean>(showMultipleSelect);
	const [selectionTable, setSelectionTable] = useState<string[]>([]);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({});

	const sortedItems = React.useMemo(() => {
		return [...dispatchers].sort((a: Dispatcher, b: Dispatcher) => {
		  const first = a[sortDescriptor.column as keyof Dispatcher] as number;
		  const second = b[sortDescriptor.column as keyof Dispatcher] as number;
		  const cmp = first < second ? -1 : first > second ? 1 : 0;
	
		  return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, dispatchers]);

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
								<DropdownItem onClick={() => onMultipleSelect([dispatcher], "enable")}>
									Enable
								</DropdownItem>
								<DropdownItem onClick={() => onMultipleSelect([dispatcher], "disable")}>
									Disable
								</DropdownItem>
								<DropdownItem onClick={() => onMultipleSelect([dispatcher], "assignDriver")}>
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
	const handlerSelectionChange = (e: any) => {
		const arrFromSet = [...e]
		e.size === 0 ? setSelectionTable([]) : setSelectionTable(arrFromSet);
    };
	
	useEffect(() => {
		setModeSelectionTable(showMultipleSelect)
	},[showMultipleSelect])

	useEffect(() => {
		listDispatchersId(selectionTable.map(str => parseInt(str)))
	},[selectionTable])

	return (
		<InfiniteScroll 
			dataLength={dispatchers.length}
			next={() => setTimeout(fetchNextPage, 1000)}
			hasMore={hasNextPage}
			loader={
				<div className="flex justify-center py-10">
					<Spinner />
				</div>
			}
			style={{ paddingBottom: "10px" }}>
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
							align={column.uid === "actions" ? "center" : "start"}
							allowsSorting={column.uid !== "actions"}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					loadingState={isLoading ? "loading" : "idle"}
					loadingContent={<Spinner size="sm" color="primary" />}
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
