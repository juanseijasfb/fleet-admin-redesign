import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import DispatcherTable from "@/components/dispatcherTable";
import AddDispatcherForm from "@/components/forms/AddDispatchForm";
import AssignedDriver from "@/components/forms/AssignedDriver";
import useCreateDispatch from "@/hooks/api/useCreateDispatch";
import {
	useGetAssignedDriver,
	useGetUnassignedDriver,
} from "@/hooks/api/useGetAssignedDriver";
import useGetDispatchers from "@/hooks/api/useGetDispatcher";
import useGetDriversInfinite from "@/hooks/api/useGetDrivers";
import useSearch from "@/hooks/useSearch";
import { type Dispatcher, DriverUnassignedResponseAPI } from "@/utils/types";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";

export default function index() {
	const [selectedDriverEmail, setSelectedDriverEmail] = useState("");
	const { search, handleSearch, debounced } = useSearch("dispatcher");
	const { dispatchersInfinite, isLoading, fetchNextPage, hasNextPage } = useGetDispatchers({
		search: debounced,
	});

	const [dispatchName, setDispatchName] = useState("");
	const { assignedDriver, isLoadingAssigned } = useGetAssignedDriver(selectedDriverEmail);
	const { unassignedDriver, isLoadingUnassigned } = useGetUnassignedDriver(selectedDriverEmail);
	const modal = useDisclosure();
	const modalAssDriver = useDisclosure();
	const { createDispatch, isPending } = useCreateDispatch(() => {
		modal.onClose();
	});

	const handleAction = (dispatcher: Dispatcher[]) => {
		setDispatchName(`${dispatcher[0].firstName} ${dispatcher[0].lastName}`);
		setSelectedDriverEmail(dispatcher[0].email);
		modalAssDriver.onOpen();
	};

	const handleAssignedDriverSubmit = (values: string[]) => {
		console.log(values);
	};
	const dispatchers = dispatchersInfinite?.pages.flatMap(page => page.data) || [];
	console.log(unassignedDriver)
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
						onMultipleSelect={(e: Dispatcher[]) => handleAction(e)}
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
