import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { DriverAssignedResponseAPI, DriverUnassignedResponseAPI } from "@/utils/types";
import Select from "react-select";

interface AssignedDriverProps {
  onSubmit: (values: string[]) => void;
  onClose: () => void;
  isLoading?: boolean;
  dispatcherName: string;
  driverAssigned: DriverAssignedResponseAPI[];
  driverUnassigned: DriverUnassignedResponseAPI[];
}

const getFormattedDrivers = (data: any[]) =>
  data.map((driver) => ({
    label: driver.fullName.replace(/,/g, " "),
    value: driver.driverId.toString(),
}));

export default function AssignedDriver({
  onSubmit,
  onClose,
  isLoading,
  dispatcherName,
  driverAssigned,
  driverUnassigned,
}: AssignedDriverProps) {
  const [selectedIds, setSelectedIds] = useState<{ label: string; value: string }[]>([]);

  const totalDrivers = [...driverAssigned, ...driverUnassigned];
  const totalDriversList = getFormattedDrivers(totalDrivers);

  useEffect(() => {
    const formattedAssignedDrivers = getFormattedDrivers(driverAssigned);
    setSelectedIds(formattedAssignedDrivers);
  }, [driverAssigned]);
  
  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold text-2xl pt-2">
        Driver Assigned to {dispatcherName}
      </h3>
      <Select
        value={selectedIds}
        isMulti
        options={totalDriversList}
        onChange={(e: any) => setSelectedIds(e)}
      />
      <div className="flex justify-end gap-4">
        <Button isLoading={isLoading} onClick={() => onClose()} color="danger" variant="light">
          Cancel
        </Button>
        <Button isLoading={isLoading} onClick={() => onSubmit(selectedIds.map(option => option.value))} color="primary">
          Save
        </Button>
      </div>
    </div>
  );
}
