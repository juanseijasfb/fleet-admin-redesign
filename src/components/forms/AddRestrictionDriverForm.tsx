import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input } from "@nextui-org/react";
import Select from "../Select";
import TextInput from "../TextInput";
import { driverSchema, restrictionDriveSchema } from "./schema";
import SelectCarriers from "../SelectCarriers";

export interface AddRestrictionDriverValues {
  driver: string;
  city: string;
  state: string;
}
interface AddRestrictionDriverProps {
  onClose: () => void;
  onSubmit: (values: AddRestrictionDriverValues) => void;
  isLoading?: boolean;
  initialValues?: AddRestrictionDriverValues;
}
export default function AddRestrictionDriverForm({
  onClose,
  onSubmit,
  isLoading,
  initialValues,
}: AddRestrictionDriverProps) {
  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      driver: initialValues?.driver || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
    },
    validationSchema: restrictionDriveSchema,
    onSubmit: onSubmit,
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold text-2xl pt-2">City and States Restrictions</h3>
      <Select
        size="lg"
        options={[{ label: "Driver1", value: "Driver1" }]}
        onChange={handleChange("driver")}
        isValid={!errors.driver}
        errorMessage={errors.driver}
        placeholder="Select Driver"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          size="lg"
          options={[{ label: "City1", value: "City1" }]}
          onChange={handleChange("city")}
          isValid={!errors.city}
          errorMessage={errors.city}
          placeholder="Select City"
        />
        <Select
          size="lg"
          options={[{ label: "State1", value: "State1" }]}
          onChange={handleChange("state")}
          isValid={!errors.state}
          errorMessage={errors.state}
          placeholder="Select State"
        />
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
