import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import DispatcherTable from "@/components/dispatcherTable";
import AddDispatcherForm from "@/components/forms/AddDispatchForm";
import AssignedDriver from "@/components/forms/AssignedDriver";
import { useDisableDispatch, useEnableDispatch } from "@/hooks/api/useChangeStatusDispatch";
import useCreateDispatch from "@/hooks/api/useCreateDispatch";
import { useAddDriverToDispatcher, useRemoveDriverToDispatcher } from "@/hooks/api/useDriverToDispatcher";
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
	const { dispatchersInfinite, dispatchersAll, isLoading, fetchNextPage, hasNextPage, refetchDispatchers } = useGetDispatchers({
		search: debounced,
	});
	const {addDriverToDispatcher, isPendingAssignedDriver} = useAddDriverToDispatcher(() => modalAssDriver.onClose());
	const {removeDriverToDispatcher, isPendingRemoveDriver} = useRemoveDriverToDispatcher(() => modalAssDriver.onClose());
	const [selectedDispatchId, setSelectedDispatchId] = useState<string>("0");
	const [dispatchName, setDispatchName] = useState("");
	const { assignedDriver, isLoadingAssigned, refetchAssignedDriver } = useGetAssignedDriver(selectedDriverEmail);
	const { unassignedDriver, isLoadingUnassigned, refecthUnassignedDriver } = useGetUnassignedDriver(selectedDriverEmail);
	const { disableDispatch } = useDisableDispatch(() => toast.success('Disabled successfully'));
	const { enableDispatch } = useEnableDispatch(() => toast.success('Enabled successfully'));
	const modal = useDisclosure();
	const modalAssDriver = useDisclosure();
	const [isDisable, setIsDisable] = useState<boolean>(false);
	const [isEnable, setIsEnable] = useState<boolean>(false);
	const [selectedIds, setSelectedIds] = useState<number[]>([])
	const [driversToDispatcherRemove ,setDriversToDispatchRemove] = useState<string>("");
	const [driversToDispatcher ,setDriversToDispatch] = useState<string>("");
	const { createDispatch, isPending } = useCreateDispatch(() => {
		modal.onClose();
	});

	const handleAction = (dispatcher: Dispatcher[], optionSelect: string) => {
		switch (optionSelect) {
			case "disable":
				setIsDisable(true);
				setSelectedDispatchId(dispatcher.map((d) => d.id.toString())[0]);
				break;
			case "enable":
				setIsEnable(true);
				setSelectedDispatchId(dispatcher.map((d) => d.id.toString())[0]);
				break;
			case "assignDriver":
				setDispatchName(`${dispatcher[0].firstName} ${dispatcher[0].lastName}`);
				setSelectedDriverEmail(dispatcher[0].email);
				refetchAssignedDriver();
				refecthUnassignedDriver();
				modalAssDriver.onOpen();
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		refetchAssignedDriver();
	}, [setDispatchName,selectedDriverEmail]);

	useEffect(() => {
		if (isDisable) {
			if(Number.isNaN(selectedIds[0])){
				disableDispatch(dispatchersAll?.map((d) => d.id).join(',') || '0');
			} else {
				disableDispatch(selectedIds.length > 1 ? selectedIds.join(',') : selectedDispatchId);
			}
		}
		if (isEnable) {
			if(Number.isNaN(selectedIds[0])){
				enableDispatch(dispatchersAll?.map((d) => d.id).join(',') || '0');
			} else {
				enableDispatch(selectedIds.length > 1 ? selectedIds.join(',') : selectedDispatchId);
			}
		}
		refetchDispatchers();
		setSelectedDispatchId("0");
		setIsDisable(false);
		setIsEnable(false);
	}, [isDisable, isEnable])

	useEffect(() => {
		if(selectedDriverEmail){
			if(driversToDispatcher){
				addDriverToDispatcher({dispatcherEmail:selectedDriverEmail, driversList:driversToDispatcher});
			}
			if(driversToDispatcherRemove){
				removeDriverToDispatcher({dispatcherEmail:selectedDriverEmail, driversList:driversToDispatcherRemove});
			}
			toast.success('Driver assigned successfully')
		}
	}, [driversToDispatcher, driversToDispatcherRemove])

	const handleSaveForm = (values:string[], valuesRemove:string[]) => {
		setDriversToDispatchRemove(valuesRemove.join(','));
		setDriversToDispatch(values.join(','));
	} 

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
						listDispatchersId={(e) => setSelectedIds(e)}
						fetchNextPage={fetchNextPage}
						hasNextPage={hasNextPage}
					/>
				}
			</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddDispatcherForm
					isLoading={isPending}
					dispatchersEmail={dispatchersAll?.map((d) => d.email) ?? []}
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
						onSubmit={(values, valuesRemove) => handleSaveForm(values, valuesRemove)}
						isLoading={isLoadingAssigned && isLoadingUnassigned && isPendingAssignedDriver && isPendingRemoveDriver}
						dispatcherName={dispatchName}
						driverAssigned={assignedDriver ?? []}
						driverUnassigned={unassignedDriver ?? []}
					/>
				)}
			</ModalForm>
		</LayoutDashboard>
	);
}
