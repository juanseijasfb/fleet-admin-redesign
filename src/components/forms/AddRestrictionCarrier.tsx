import { Button } from "@nextui-org/react";
import Select from "../Select";
import { BrokerResponseAPI } from "@/utils/types";
import { useFormik } from "formik";
import { addRestrictionBrokerSchema } from "./schema";
import { Inter_Tight } from "next/font/google";

export interface AddRestrictionCarrierValues {
  subject: string;
	type: string;
	subjectValue: string;
	typeValue: string;
	validUntil: string;
}
export interface CarrierTableValues {
  carrier: string;
  mcNumber: number;
}
type Props = {
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (values: AddRestrictionCarrierValues) => void;
  carrierSelected?: CarrierTableValues;
  listBroker?: BrokerResponseAPI[];
  initialValues?: AddRestrictionCarrierValues;
};

export default function AddRestrictionCarrier({
  onClose,
  onSubmit,
  isLoading,
  carrierSelected,
  listBroker,
  initialValues,
}: Props) {
  const { values, errors, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      subject: "C",
      type: "B",
      subjectValue: carrierSelected?.mcNumber.toString() || "",
      typeValue: initialValues?.typeValue || "",
      validUntil: "2099-12-31%2000:00:00"
    },
    validationSchema: addRestrictionBrokerSchema,
    onSubmit: onSubmit,
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold pt-2 ">Restriction to Carrier {carrierSelected?.carrier}</h3>
      <div>
        <Select
          size="lg"
          options={
            listBroker?.map((broker) => ({
              label: broker.MCNumber + " - " + broker.CompanyName,
              value: broker.MCNumber,
            })) ?? []
          }
          onChange={(e: any) => setFieldValue("typeValue", e.target.value)}
          placeholder="Broker Selector"
        />
        {errors.typeValue && (
          <span className="text-red-500 text-xs leading-3">
            {errors.typeValue}
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
