import { Button } from "@nextui-org/react";
import Select from "../Select";

type Props = {
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (values: string) => void;
  companyName: string;
};

export default function AddRestrictionCarrier({
  onClose,
  onSubmit,
  isLoading,
  companyName,
}: Props) {
  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold pt-2 ">Restriction to Carrier {companyName}</h3>
      <Select
        size="lg"
        options={[
          { label: "Broker1", value: "Broker1" },
          { label: "Broker2", value: "Broker2" },
          { label: "Broker3", value: "Broker3" },
        ]}
        placeholder="Broker Selector"
      />

      <div className="flex justify-end gap-4">
        <Button
          onClick={() => onClose()}
          isLoading={isLoading}
          color="danger"
          variant="light"
        >
          Cancel
        </Button>
        <Button isLoading={isLoading} color="primary">
          Save
        </Button>
      </div>
    </div>
  );
}
