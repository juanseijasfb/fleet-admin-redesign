import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button } from "@nextui-org/react";
import { restrictionDriveSchema } from "./schema";
import { States } from "@/constants/states";
import { useGetCities } from "@/hooks/api/useGetCities";
import { GetCitiesResponseAPI } from "@/utils/types";
import Selecting from "react-select";

export interface AddRestrictionDriverValues {
	subject: string;
	state?: string;
	type: string;
	subjectValue: string;
	typeValue: string;
	validUntil: string;
}
interface AddRestrictionDriverProps {
	onClose: () => void;
	onSubmit: (values: AddRestrictionDriverValues) => void;
	isLoading?: boolean;
	initialValues?: AddRestrictionDriverValues;
	driverList: { label: string; value: string }[];
}

const handlerGetStates = (cities: GetCitiesResponseAPI[]) => {
	return cities
		.filter((city, index, array) => {
			return (
				array.findIndex(
					(obj) => obj.city === city.city && obj.state_id === city.state_id,
				) === index
			);
		})
		.map((city) => ({
			label: city.city,
			value: city.city+":"+city.state_id,
		}));
};

export default function AddRestrictionDriverForm({
	onClose,
	onSubmit,
	isLoading,
	initialValues,
	driverList,
}: AddRestrictionDriverProps) {
	const { values, errors, handleSubmit, setFieldValue } = useFormik({
		initialValues: {
			subject: "D",
			state: initialValues?.state || "",
			type: initialValues?.type || "ST",
			subjectValue: initialValues?.subjectValue || "",
			typeValue: initialValues?.typeValue || "",
			validUntil: "2099-12-31 00:00:00",
		},
		validationSchema: restrictionDriveSchema,
		onSubmit: onSubmit,
	});
	const [getCityList, setGetCityList] = useState<{ label: string; value: string }[]>([]);

	const { cities, isLoadingCities, isError } = useGetCities(values.state);

	useEffect(() => {
		if (!isLoadingCities && !isError && cities) {
			setGetCityList(handlerGetStates(cities));
		}
		setFieldValue("typeValue", "");
	}, [values.state, isLoadingCities, isError, cities]);

	return (
		<div className="flex flex-col gap-8 py-4">
			<h3 className="font-bold text-2xl pt-2">City and States Restrictions</h3>
			<div>
				<Selecting
					options={driverList}
					onChange={(e) => setFieldValue("subjectValue", e?.value)}
					placeholder="Select Driver"
				/>
				{errors.subjectValue && (
					<span className="text-red-500 text-xs leading-3">
						{errors.subjectValue}
					</span>
				)}
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Selecting
						options={States}
						onChange={(e) => setFieldValue("state", e?.value)}
						placeholder="Select State"
					/>
					{errors.state && (
						<span className="text-red-500 text-xs leading-3">
							{errors.state}
						</span>
					)}
				</div>
				<div>
					<Selecting
						options={isLoadingCities ? [] : getCityList}
						isOptionSelected={(e) => e.value === values.typeValue}
						onChange={(e: any) => {setFieldValue("typeValue", e?.value), setFieldValue("type", "CI")}}
						placeholder={
							isLoadingCities
								? "Loading cities..."
								: cities
									? "Select City"
									: "No cities"
						}
					/>
				</div>
			</div>
			<div className="flex justify-end gap-4">
				<Button
					onClick={() => onClose()}
					isLoading={isLoading}
					color="danger"
					variant="light"
				>
					Cancel
				</Button>
				<Button
					onClick={() => handleSubmit()}
					isLoading={isLoading}
					color="primary"
				>
					Save
				</Button>
			</div>
		</div>
	);
}
