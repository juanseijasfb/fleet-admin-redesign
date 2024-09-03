import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { DriverAssignedResponseAPI, DriverUnassignedResponseAPI, OptionSelect } from "@/utils/types";
import Select, { ActionMeta, MultiValue } from "react-select";

interface AssignedDriverProps {
  onSubmit: (values: string[], valuesRemove: string[]) => void;
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
  const [selectedIds, setSelectedIds] = useState<MultiValue<OptionSelect>>([]);
  const [selectedIdsRemove, setSelectedIdsRemove] = useState<string[]>([]);

  const totalDrivers = [...driverAssigned, ...driverUnassigned];
  const totalDriversList = getFormattedDrivers(totalDrivers);

  useEffect(() => {
    const formattedAssignedDrivers = getFormattedDrivers(driverAssigned);
    setSelectedIds(formattedAssignedDrivers);
  }, [driverAssigned]);
  
  const handleChangeSelect = (newValue:MultiValue<OptionSelect>, actionMeta:ActionMeta<OptionSelect>) => {
    setSelectedIdsRemove([...selectedIdsRemove , actionMeta.removedValue?.value.toString() as string]);
    setSelectedIds(newValue);
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <h3 className="font-bold text-2xl pt-2">
        Driver Assigned to {dispatcherName}
      </h3>
      <Select
        value={selectedIds}
        isMulti
        options={totalDriversList.sort((a, b) => a.label.localeCompare(b.label))}
        onChange={(newValue, actionMeta) => handleChangeSelect(newValue, actionMeta)}
      />
      <div className="flex justify-end gap-4">
        <Button isLoading={isLoading} onClick={() => {onClose(); setSelectedIdsRemove([]);}} color="danger" variant="light">
          Cancel
        </Button>
        <Button isLoading={isLoading} onClick={() => {onSubmit(selectedIds.map(option => option.value), selectedIdsRemove); setSelectedIdsRemove([]);}} color="primary">
          Save
        </Button>
      </div>
    </div>
  );
}
