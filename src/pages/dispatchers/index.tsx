import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import DispatcherTable from "@/components/dispatcherTable";
import AddDispatcherForm from "@/components/forms/AddDispatchForm";
import AssignedDriver from "@/components/forms/AssignedDriver";
import { useDisableDispatch, useEnableDispatch } from "@/hooks/api/useChangeStatusDispatch";
import useCreateDispatch from "@/hooks/api/useCreateDispatch";
import {
	useGetAssignedDriver,
	useGetUnassignedDriver,
} from "@/hooks/api/useGetAssignedDriver";
import useGetDispatchers from "@/hooks/api/useGetDispatcher";
import useSearch from "@/hooks/useSearch";
import { type Dispatcher, DriverUnassignedResponseAPI } from "@/utils/types";
import { useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function index() {
	const [selectedDriverEmail, setSelectedDriverEmail] = useState("");
	const { search, handleSearch, debounced } = useSearch("dispatcher");
	const { dispatchersInfinite, isLoading, fetchNextPage, hasNextPage, refetchDispatchers } = useGetDispatchers({
		search: debounced,
	});
	const [selectedDispatchId, setSelectedDispatchId] = useState<number>(0);
	const [dispatchName, setDispatchName] = useState("");
	const { assignedDriver, isLoadingAssigned, refetchAssignedDriver } = useGetAssignedDriver(selectedDriverEmail);
	const { unassignedDriver, isLoadingUnassigned } = useGetUnassignedDriver(selectedDriverEmail);
	const { disableDispatch } = useDisableDispatch(selectedDispatchId);
	const { enableDispatch } = useEnableDispatch(selectedDispatchId);
	const modal = useDisclosure();
	const modalAssDriver = useDisclosure();
	const [optionSelected, setOptionSelect] = useState<string>();
	const { createDispatch, isPending } = useCreateDispatch(() => {
		modal.onClose();
	});

	const handleAction = (dispatcher: Dispatcher[], optionSelect: string) => {
		setOptionSelect(optionSelect);
		switch (optionSelect) {
			case "disable":
				setSelectedDispatchId(dispatcher.map((d) => d.id)[0]);
				break;
			case "enable":
				setSelectedDispatchId(dispatcher.map((d) => d.id)[0]);
				break;
			case "assignDriver":
				setDispatchName(`${dispatcher[0].firstName} ${dispatcher[0].lastName}`);
				setSelectedDriverEmail(dispatcher[0].email);
				modalAssDriver.onOpen();
				break;
			default:
				break;
		}
	};
	useEffect(() => {
		switch (optionSelected) {
			case "disable":
				disableDispatch();
				refetchDispatchers();
				break;
			case "enable":
				enableDispatch();
				refetchDispatchers();
				break;
			default:
				refetchDispatchers();
				break;
		}
		setOptionSelect("");
		setSelectedDispatchId(0);
	}, [optionSelected, selectedDispatchId]);
	useEffect(() => {
		refetchAssignedDriver();
	}, [setDispatchName,selectedDriverEmail]);
	const handleAssignedDriverSubmit = (values: string[]) => {
		console.log(values);
    modalAssDriver.onClose();
    toast.success('Driver assigned successfully');
	};
	const dispatchers = dispatchersInfinite?.pages.flatMap(page => page.data) || [];
  
	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Dispatchers"
				addButtonText="Create Dispatcher"
				placeholderSearch="Search Dispatcher"
				addButtonAction={() => modal.onOpen()}
				defaultSearch={search}
				onChangeSearch={(e: React.ChangeEvent<HTMLInputElement>) => {
					handleSearch(e.target.value);
				}}
			/>
			<div className="px-10">
				{
					<DispatcherTable
						isLoading={isLoading}
						dispatchers={dispatchers ?? []}
						onMultipleSelect={(e: Dispatcher[], optionSelect:string) => handleAction(e, optionSelect)}
						fetchNextPage={fetchNextPage}
						hasNextPage={hasNextPage}
					/>
				}
			</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddDispatcherForm
					isLoading={isPending}
					onSubmit={(values) => {
						createDispatch(values);
					}}
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalAssDriver.isOpen}
				onOpenChange={modalAssDriver.onOpenChange}
			>
				{isLoadingAssigned || isLoadingUnassigned ? (
					<div className="flex flex-col gap-8 py-4">
						<h3 className="font-bold text-2xl pt-2">Driver Assigned to ...</h3>
					</div>
				) : (
					<AssignedDriver
						onClose={modalAssDriver.onClose}
						onSubmit={(values) => {
							handleAssignedDriverSubmit(values);
						}}
						isLoading={isLoadingAssigned && isLoadingUnassigned}
						dispatcherName={dispatchName}
						driverAssigned={assignedDriver ?? []}
						driverUnassigned={unassignedDriver ?? []}
					/>
				)}
			</ModalForm>
		</LayoutDashboard>
	);
}
