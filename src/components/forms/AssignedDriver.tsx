import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import Select from "../Select";

interface Option {
  label: string;
  value: string;
}
interface AssignedDriverProps {
  onSubmit: (values: string[]) => void;
  isLoading?: boolean;
  dispatcherName: string;
  driverAssigned: string[];
  driverUnassigned: string[];
}

const getOptions = (data: string[]): Option[] => {
  return data.map((item) => ({ label: "Driver " + item, value: item }));
};

export default function AssignedDriver({
  onSubmit,
  isLoading,
  dispatcherName,
  driverAssigned,
  driverUnassigned,
}: AssignedDriverProps) {
  const [idAssigned, setIdAssigned] = useState(driverAssigned);
  const totalDrivers = [...driverAssigned, ...driverUnassigned];
  const totalDriversList = getOptions(totalDrivers);

  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold text-2xl pt-2">
        Driver Assigned to {dispatcherName}
      </h3>
      <Select
        size="lg"
        selectionMode="multiple"
        value={idAssigned}
        options={totalDriversList}
        onSelectionChange={setIdAssigned}
        placeholder="Drivers"
      />
      <div className="flex justify-end gap-4">
        <Button isLoading={isLoading} color="danger" variant="light">
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          onClick={() => onSubmit(idAssigned)}
          color="primary"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
