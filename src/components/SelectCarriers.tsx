import useGetCarriers from "@/hooks/api/useGetCarriers";
import React from "react";
import Select from "./Select";

interface SelectCarriersProps {
	onChange?: (value: string) => void;
	value?: string;
	isValid?: boolean;
	errorMessage?: string;
	defaultSelectedKeys?: string;
}
export default function SelectCarriers({
	onChange,
	value,
	isValid,
	errorMessage,
	defaultSelectedKeys
}: SelectCarriersProps) {
	const { carriers, isLoading, isError } = useGetCarriers();
	return (
		<Select
			size="lg"
			isValid={isValid}
			errorMessage={errorMessage}
			onChange={(e) => {
				if (onChange) {
					onChange(e.target.value);
				}
			}}
			value={value}
			defaultValue={defaultSelectedKeys}
			options={
				carriers?.map((carrier) => ({
					label: `(${carrier.mcNumber}) ${carrier.carrier}`,
					value: `${carrier.mcNumber}-${carrier.carrier}`,
				})) || []
			}
			isLoading={isLoading}
			placeholder="Select Carrier"
		/>
	);
}
