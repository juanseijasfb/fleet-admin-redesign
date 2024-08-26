import React from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
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
import type { Carrier } from "@/utils/types";
import InfiniteScroll from "react-infinite-scroll-component";

interface CarrierTableProps {
	carriers: Carrier[];
	onMultipleSelect: (selected: Carrier[]) => void;
	isLoading?: boolean;
	fetchNextPage: () => void,
	hasNextPage: boolean,
}

export default function CarrierTable({
	carriers,
	onMultipleSelect,
	isLoading,
	fetchNextPage,
	hasNextPage,
}: CarrierTableProps) {

	const renderCell = React.useCallback(
		(carrier: Carrier, columnKey: ColumnKeys) => {
			const cellValue = carrier[columnKey as keyof Carrier];

			switch (columnKey) {
				case "actions":
					return (
						<Dropdown>
							<DropdownTrigger>
								<Button variant="light">
									<BsThreeDotsVertical size={20} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem onClick={() => onMultipleSelect([carrier])}>
									Add restriction broker
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
		<InfiniteScroll
			dataLength={carriers.length}
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
					isLoading={isLoading}
					loadingContent={<Spinner />}
					items={carriers}
				>
					{(item) => (
						<TableRow key={item.mcNumber}>
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
