import { Carrier } from "@/utils/types";
const columns = [
  { name: "#", uid: "id" },
  { name: "MC", uid: "mcNumber" },
  { name: "Carrier Name", uid: "carrier" },
  { name: "", uid: "actions" },
];

export type ColumnKeys = keyof Carrier | "actions" | "id";
export { columns };
