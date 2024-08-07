import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input } from "@nextui-org/react";
import Select from "../Select";
import TextInput from "../TextInput";
import { driverSchema } from "./schema";
import SelectCarriers from "../SelectCarriers";

export interface AddDriverValues {
	firstName: string;
	lastName: string;
	email: string;
	mcNumber: string;
	carrierName: string;
	maxLoadWeight: string;
	trailerType: string;
}
interface AddDriverFormProps {
	onSubmit: (values: AddDriverValues) => void;
	initialValues?: AddDriverValues;
	isLoading?: boolean;
	type: "create" | "edit";
	driverEmail: string[];
}
export default function AddDriverForm({
	onSubmit,
	initialValues,
	isLoading,
	type = "create",
	driverEmail
}: AddDriverFormProps) {
	const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
		initialValues: {
			firstName: initialValues?.firstName || "",
			lastName: initialValues?.lastName || "",
			email: initialValues?.email || "",
			mcNumber: initialValues?.mcNumber || "",
			carrierName: initialValues?.carrierName || "",
			maxLoadWeight: initialValues?.maxLoadWeight || "99999",
			trailerType: initialValues?.trailerType || "",
		},
		validationSchema: driverSchema(driverEmail),
		onSubmit: onSubmit,
	});

	console.log("values", initialValues);
	return (
		<div className="flex flex-col gap-8 py-4">
			<h3 className="font-bold text-2xl pt-2">
				{type === "create" ? "Create" : "Update"} Driver
			</h3>
			<div className="grid md:grid-cols-2 gap-4">
				<TextInput
					label="First Name"
					value={values.firstName}
					onChange={handleChange("firstName")}
					onBlur={handleBlur("firstName")}
					isValid={!errors.firstName}
					errorMessage={errors.firstName}
				/>
				<TextInput
					label="Last Name"
					value={values.lastName}
					onChange={handleChange("lastName")}
					onBlur={handleBlur("lastName")}
					isValid={!errors.lastName}
					errorMessage={errors.lastName}
				/>
			</div>
			<TextInput
				label="Email"
				value={values.email}
				onChange={handleChange("email")}
				onBlur={handleBlur("email")}
				isValid={!errors.email}
				errorMessage={errors.email}
			/>
			<SelectCarriers
				isValid={!errors.carrierName}
				errorMessage={errors.carrierName}
				value={`${values.mcNumber}-${values.carrierName}`}
				onChange={(value) => {
					const [mcNumber, carrierName] = value.split("-");
					handleChange("mcNumber")(mcNumber);
					handleChange("carrierName")(carrierName);
				}}
			/>
			<TextInput
				label="Max Load Weight"
				value={values.maxLoadWeight}
				onChange={handleChange("maxLoadWeight")}
				onBlur={handleBlur("maxLoadWeight")}
				isValid={!errors.maxLoadWeight}
				errorMessage={errors.maxLoadWeight}
				type="number"
			/>
			<Select
				size="lg"
				value={"V"}
				onChange={handleChange("trailerType")}
				isValid={!errors.trailerType}
				errorMessage={errors.trailerType}
				options={[
					{ label: "R", value: "R" },
					{ label: "F", value: "F" },
					{ label: "V", value: "V" },
				]}
				placeholder="Select Trailer Type"
			/>

			<Button
				onClick={() => handleSubmit()}
				isLoading={isLoading}
				color="primary"
			>
				Create
			</Button>
		</div>
	);
}
