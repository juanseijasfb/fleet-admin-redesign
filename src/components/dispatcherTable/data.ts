import { Dispatcher, Driver } from "@/utils/types";
import React from "react";
const columns = [
	{ name: "#", uid: "id" },
	{ name: "First & Last Name", uid: "name" },
	{ name: "Email", uid: "email" },
	{ name: "Role", uid: "role" },
	{ name: "Status", uid: "status" },
	{ name: "", uid: "actions" },
];

export type ColumnKeys = keyof Dispatcher | "actions" | "name";
export { columns };
