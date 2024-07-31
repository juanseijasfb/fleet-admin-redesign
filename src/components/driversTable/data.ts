import { Driver } from "@/utils/types";
import React from "react";
const columns = [
	{ name: "#", uid: "id" },
	{ name: "First Name", uid: "firstName" },
	{ name: "Last Name", uid: "lastName" },
	{ name: "Email", uid: "email" },
	{ name: "(MC) Carrier", uid: "carrier" },
	{ name: "Max Load Weight", uid: "weight" },
	{ name: "Trailer Type", uid: "equipment" },
	{ name: "Status", uid: "status" },
	{ name: "", uid: "actions" },
];

export type ColumnKeys = keyof Driver | "actions" | "weight";
export { columns };
