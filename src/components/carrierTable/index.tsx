import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
import { Carrier } from "@/utils/types";

interface CarrierTableProps {
  rows: Carrier[];
  onMultipleSelect?: (selected: Carrier[]) => void;
}

export default function CarrierTable({ rows }: CarrierTableProps) {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
  const [page, setPage] = React.useState(1);
  const [indice, setIndice] = React.useState(0);
  const rowsPerPage = 6;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

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
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    []
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
        <TableBody items={items}>
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
    </div>
  );
}
