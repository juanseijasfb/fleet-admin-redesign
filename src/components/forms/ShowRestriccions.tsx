import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { GetRestriccionResponseAPI } from "@/utils/types";
import Select from "react-select";

interface AssignedDriverProps {
	onSubmit: (values: GetRestriccionResponseAPI) => void;
	onClose: () => void;
	isLoading?: boolean;
	restriccionDriverList: GetRestriccionResponseAPI[];
	nameDriver: string;
	getLabel?: (resitrccionId: string) => Promise<string>;
}

export default function ShowRestrictions({
	onSubmit,
	onClose,
	isLoading,
	restriccionDriverList,
	nameDriver,
	getLabel,
}: AssignedDriverProps) {
	const [selectedRestriction, setSelectedRestriction] = useState<number>(0);
	const [selectedOption, setSelectedOption] = useState<{
		value: number;
		label: string;
	} | null>(null);

	const handleChange = (option: { value: number; label: string } | null) => {
		setSelectedOption(option);
		option !== null && setSelectedRestriction(option.value);
	};

	return (
		<div className="flex flex-col gap-8 py-4">
			<h1 className="font-bold text-2xl">Restrictions for {nameDriver}</h1>
			<div>
				<Select
					placeholder="Select a restriction"
					value={selectedOption}
					onChange={handleChange}
					isClearable
					options={restriccionDriverList.map((restriccion, index) => ({
						value: index,
						label: getLabel
							? getLabel(restriccion.TypeValue)
									.then((e) => e)
									.catch(() => restriccion.TypeValue)
							: restriccion.TypeValue,
					}))}
				/>
			</div>

			<div className="flex justify-end gap-4">
				<Button
					isLoading={isLoading}
					onClick={() => onClose()}
					color="danger"
					variant="light"
				>
					Close
				</Button>

				{selectedOption !== null && (
					<Button
						isLoading={isLoading}
						onClick={() => onSubmit(restriccionDriverList[selectedRestriction])}
						color="danger"
					>
						Delete
					</Button>
				)}
			</div>
		</div>
	);
}
