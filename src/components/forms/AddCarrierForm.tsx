import React from "react";
import { useFormik } from "formik";
import { Button } from "@nextui-org/react";
import TextInput from "../TextInput";
import { carrierSchema } from "./schema";

export interface AddCarrierValues {
  mc: string;
  carrierName: string;
}
interface AddCarrierFormProps {
  onSubmit: (values: AddCarrierValues) => void;
  initialValues?: AddCarrierValues;
  isLoading?: boolean;
}
export default function AddCarrierForm({
  onSubmit,
  initialValues,
  isLoading,
}: AddCarrierFormProps) {
  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      mc: initialValues?.mc || "",
      carrierName: initialValues?.carrierName || "",
    },
    validationSchema: carrierSchema,
    onSubmit: onSubmit,
  });

  console.log("values", errors);
  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold text-2xl pt-2">Create Carrier</h3>
      <TextInput
        label="MC"
        value={values.mc}
        onChange={handleChange("mc")}
        onBlur={handleBlur("mc")}
        isValid={!errors.mc}
        errorMessage={errors.mc}
      />
      <TextInput
        label="Carrier Name"
        value={values.carrierName}
        onChange={handleChange("carrierName")}
        onBlur={handleBlur("carrierName")}
        isValid={!errors.carrierName}
        errorMessage={errors.carrierName}
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
