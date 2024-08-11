import React from "react";
import { useFormik } from "formik";
import { Button, Switch } from "@nextui-org/react";
import Select from "../Select";
import TextInput from "../TextInput";
import { dispatcherSchema } from "./schema";

export interface AddDispatchValues {
  firstName: string;
  lastName: string;
  dispatcherEmail: string;
  role: string;
  enabled: boolean;
}
interface AddDispatchFormProps {
  onSubmit: (values: AddDispatchValues) => void;
  initialValues?: AddDispatchValues;
  isLoading?: boolean;
  dispatchersEmail: string[];
}
export default function AddDispatcherForm({
  onSubmit,
  initialValues,
  isLoading,
  dispatchersEmail
}: AddDispatchFormProps) {
  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      dispatcherEmail: initialValues?.dispatcherEmail || "",
      role: initialValues?.role || "",
      enabled: initialValues?.enabled || true,
    },
    validationSchema: dispatcherSchema(dispatchersEmail),
    onSubmit: onSubmit,
  });

  console.log("values", errors);
  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold text-2xl pt-2">Create Dispatcher</h3>
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
        value={values.dispatcherEmail}
        onChange={handleChange("dispatcherEmail")}
        onBlur={handleBlur("dispatcherEmail")}
        isValid={!errors.dispatcherEmail}
        errorMessage={errors.dispatcherEmail}
      />
      <Select
        size="lg"
        value={values.role}
        onChange={handleChange("role")}
        isValid={!errors.role}
        errorMessage={errors.role}
        options={[{ label: "D", value: "D" }]}
        placeholder="Select Role"
      />
      <Switch
        defaultSelected
        checked={values.enabled}
        onChange={handleChange("enabled")}
      >
        Enabled
      </Switch>
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
