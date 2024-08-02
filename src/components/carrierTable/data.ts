import { Carrier } from "@/utils/types";
const columns = [
  { name: "MC", uid: "mcNumber" },
  { name: "Carrier Name", uid: "carrier" },
  { name: "", uid: "actions" },
];

export type ColumnKeys = keyof Carrier | "actions";
export { columns };
