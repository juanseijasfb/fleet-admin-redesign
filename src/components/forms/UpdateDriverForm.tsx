import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input } from "@nextui-org/react";
import Select from "../Select";
import TextInput from "../TextInput";
import { driverSchema, driverUpdateSchema } from "./schema";
import SelectCarriers from "../SelectCarriers";

export interface UpdateDriverValues {
  firstName: string;
  lastName: string;
  email: string;
  mcNumber: string;
  carrier: string;
  equipment: string;
  weight: string;
}
interface UpdateDriverFormProps {
  defaultValues: UpdateDriverValues[];
  onSubmit: (values: UpdateDriverValues) => void;
  initialValues?: UpdateDriverValues;
  isLoading?: boolean;
}
export default function UpdateDriverForm({
  defaultValues,
  onSubmit,
  initialValues,
  isLoading,
}: UpdateDriverFormProps) {
  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      firstName: defaultValues[0]?.firstName || "",
      lastName: defaultValues[0].lastName || "",
      email: defaultValues[0].email || "",
      mcNumber: defaultValues[0].mcNumber || "",
      carrier: defaultValues[0].carrier || "",
      weight: defaultValues[0].weight || "",
      equipment: defaultValues[0].equipment || "",
    },
    validationSchema: driverUpdateSchema,
    onSubmit: onSubmit,
  });
  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold text-2xl pt-2">Create Driver</h3>
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
        isValid={!errors.carrier}
        errorMessage={errors.carrier}
        value={`${values.mcNumber}-${values.carrier}`}
        defaultSelectedKeys={`${values.mcNumber}-${values.carrier}`}
        onChange={(value) => {
          const [mcNumber, carrier] = value.split("-");
          handleChange("mcNumber")(mcNumber);
          handleChange("carrier")(carrier);
        }}
      />
      <TextInput
        label="Max Load Weight"
        value={values.weight}
        onChange={handleChange("weight")}
        onBlur={handleBlur("weight")}
        isValid={!errors.weight}
        errorMessage={errors.weight}
        type="number"
      />
      <Select
        size="lg"
        defaultValue={values.equipment}
        onChange={handleChange("equipment")}
        isValid={!errors.equipment}
        errorMessage={errors.equipment}
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
        Update
      </Button>
    </div>
  );
}
