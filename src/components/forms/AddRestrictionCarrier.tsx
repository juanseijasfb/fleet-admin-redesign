import { Button } from "@nextui-org/react";
import Select from "../Select";
import { BrokerResponseAPI } from "@/utils/types";
import { useFormik } from "formik";
import { addRestrictionBrokerSchema } from "./schema";

export interface BrokerValues {
  MCNumber: string;
}

type Props = {
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (values: { mcNumber: string }) => void;
  companyName: string;
  listBroker?: BrokerResponseAPI[];
  initialValues?: BrokerValues;
};

export default function AddRestrictionCarrier({
  onClose,
  onSubmit,
  isLoading,
  companyName,
  listBroker,
  initialValues,
}: Props) {
  const { values, errors, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      mcNumber: initialValues?.MCNumber || "",
    },
    validationSchema: addRestrictionBrokerSchema,
    onSubmit: onSubmit,
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold pt-2 ">Restriction to Carrier {companyName}</h3>
      <div>
        <Select
          size="lg"
          options={
            listBroker?.map((broker) => ({
              label: broker.CompanyName,
              value: broker.MCNumber,
            })) ?? []
          }
          onChange={(e: any) => setFieldValue("mcNumber", e.target.value)}
          placeholder="Broker Selector"
        />
        {errors.mcNumber && (
          <span className="text-red-500 text-xs leading-3">
            {errors.mcNumber}
          </span>
        )}
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
          isLoading={isLoading}
          onClick={() => handleSubmit()}
          color="primary"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
