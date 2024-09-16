import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import DispatcherTable from "@/components/dispatcherTable";
import AddDispatcherForm from "@/components/forms/AddDispatchForm";
import AssignedDriver from "@/components/forms/AssignedDriver";
import {
	useDisableDispatch,
	useEnableDispatch,
} from "@/hooks/api/useChangeStatusDispatch";
import useCreateDispatch from "@/hooks/api/useCreateDispatch";
import {
	useAddDriverToDispatcher,
	useRemoveDriverToDispatcher,
} from "@/hooks/api/useDriverToDispatcher";
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
import { ReactSearchAutocomplete } from "react-search-autocomplete";

export default function index() {
	const [selectedDriverEmail, setSelectedDriverEmail] = useState("");
	const { search, handleSearch, debounced } = useSearch("dispatcher");
	const {
		dispatchersInfinite,
		dispatchersAll,
		isLoading,
		fetchNextPage,
		hasNextPage,
		refetchDispatchers,
	} = useGetDispatchers({
		search: debounced,
	});
	const { addDriverToDispatcher, isPendingAssignedDriver } =
		useAddDriverToDispatcher(() => modalAssDriver.onClose());
	const { removeDriverToDispatcher, isPendingRemoveDriver } =
		useRemoveDriverToDispatcher(() => modalAssDriver.onClose());
	const [selectedDispatchId, setSelectedDispatchId] = useState<string>("0");
	const [dispatchName, setDispatchName] = useState("");
	const { assignedDriver, isLoadingAssigned, refetchAssignedDriver } =
		useGetAssignedDriver(selectedDriverEmail);
	const { unassignedDriver, isLoadingUnassigned, refecthUnassignedDriver } =
		useGetUnassignedDriver(selectedDriverEmail);
	const { disableDispatch } = useDisableDispatch(() =>
		toast.success("Disabled successfully"),
	);
	const { enableDispatch } = useEnableDispatch(() =>
		toast.success("Enabled successfully"),
	);
	const modal = useDisclosure();
	const modalAssDriver = useDisclosure();
	const [isDisable, setIsDisable] = useState<boolean>(false);
	const [isEnable, setIsEnable] = useState<boolean>(false);
	const [btnMultiAction, setBtnMultiAction] = useState<boolean>(false);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [driversToDispatcherRemove, setDriversToDispatchRemove] =
		useState<string>("");
	const [driversToDispatcher, setDriversToDispatch] = useState<string>("");
	const { createDispatch, isPending } = useCreateDispatch(() => {
		modal.onClose();
	});

	const handleAction = (optionSelect: string, dispatcher?: Dispatcher[]) => {
		switch (optionSelect) {
			case "disable":
				setIsDisable(true);
				if (dispatcher) {
					setSelectedDispatchId(dispatcher.map((d) => d.id.toString())[0]);
				}
				break;
			case "enable":
				setIsEnable(true);
				if (dispatcher) {
					setSelectedDispatchId(dispatcher.map((d) => d.id.toString())[0]);
				}
				break;
			case "assignDriver":
				const listDispatcher = selectedIds
					.map((id) => dispatchersAll?.find((d) => d.id === id)?.email)
					.filter((email) => email !== undefined);

				console.log(listDispatcher.join(","));
				if (listDispatcher) {
					console.log(listDispatcher);
				}
				if (dispatcher) {
					setDispatchName(
						`${dispatcher[0].firstName} ${dispatcher[0].lastName}`,
					);
					setSelectedDriverEmail(dispatcher[0].email);
				}
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
	}, [setDispatchName, selectedDriverEmail]);

	useEffect(() => {
		if (isDisable) {
			if (selectedIds.some(Number.isNaN)) {
				disableDispatch(dispatchersAll?.map((d) => d.id).join(",") || "0");
			} else {
				disableDispatch(
					selectedIds.length > 0 ? selectedIds.join(",") : selectedDispatchId,
				);
			}
		}
		if (isEnable) {
			if (selectedIds.some(Number.isNaN)) {
				enableDispatch(dispatchersAll?.map((d) => d.id).join(",") || "0");
			} else {
				enableDispatch(
					selectedIds.length > 0 ? selectedIds.join(",") : selectedDispatchId,
				);
			}
		}
		refetchDispatchers();
		setSelectedDispatchId("0");
		setIsDisable(false);
		setIsEnable(false);
		setBtnMultiAction(false);
	}, [isDisable, isEnable]);

	useEffect(() => {
		if (selectedDriverEmail) {
			if (driversToDispatcher) {
				addDriverToDispatcher({
					dispatcherEmail: selectedDriverEmail,
					driversList: driversToDispatcher,
				});
			}
			if (driversToDispatcherRemove) {
				removeDriverToDispatcher({
					dispatcherEmail: selectedDriverEmail,
					driversList: driversToDispatcherRemove,
				});
			}
			toast.success("Driver assigned successfully");
		}
		setBtnMultiAction(false);
	}, [driversToDispatcher, driversToDispatcherRemove]);

	useEffect(() => {
		selectedIds.length > 0 || Number.isNaN(selectedIds[0])
			? setBtnMultiAction(true)
			: setBtnMultiAction(false);
	}, [selectedIds]);

	const handleSaveForm = (values: string[], valuesRemove: string[]) => {
		setDriversToDispatchRemove(valuesRemove.join(","));
		setDriversToDispatch(values.join(","));
	};

	const dispatchers =
		dispatchersInfinite?.pages.flatMap((page) => page.data) || [];

	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Dispatchers"
				addButtonText="Create Dispatcher"
				placeholderSearch="Search Dispatcher"
				multiActionBtn={btnMultiAction}
				addButtonAction={() => modal.onOpen()}
				defaultSearch={search}
				onMultipleSelect={(optionSelect) => handleAction(optionSelect)}
				onChangeSearch={(e: string) => handleSearch(e)}
				searchBox={
					<ReactSearchAutocomplete
						autoFocus={false}
						onFocus={(e: any) => console.log(e)}
						className="cursor-pointer"
						styling={{
							border: "none",
							borderRadius: "12px",
							backgroundColor: "rgb(244 244 245)",
							boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
							color: "#000",
						}}
						placeholder={"Search Driver"}
						items={dispatchersAll || []}
						showNoResults={false}
						resultStringKeyName="firstName"
						formatResult={(item) =>
							item && (
								<div>
									<div className="flex items-center gap-2">
										<span className="text-sm ">{item.firstName}</span>
										<span className="text-sm ">{item.lastName}</span>
									</div>
									<span className="text-xs text-gray-500">{item.email}</span>
								</div>
							)
						}
						onSelect={(e) => {
							handleSearch(e.firstName);
						}}
						onClear={(e: any) => handleSearch("")}
						fuseOptions={{
							keys: ["firstName", "lastName", "email", "mcNumber", "carrier"],
						}}
					/>
				}
			/>
			<div className="px-10">
				{
					<DispatcherTable
						isLoading={isLoading}
						dispatchers={dispatchers ?? []}
						onMultipleSelect={(e: Dispatcher[], optionSelect: string) =>
							handleAction(optionSelect, e)
						}
						listDispatchersId={(e) => setSelectedIds(e)}
						fetchNextPage={fetchNextPage}
						hasNextPage={hasNextPage}
						showMultipleSelect={btnMultiAction}
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
						onSubmit={(values, valuesRemove) =>
							handleSaveForm(values, valuesRemove)
						}
						isLoading={
							isLoadingAssigned &&
							isLoadingUnassigned &&
							isPendingAssignedDriver &&
							isPendingRemoveDriver
						}
						dispatcherName={dispatchName}
						driverAssigned={assignedDriver ?? []}
						driverUnassigned={unassignedDriver ?? []}
					/>
				)}
			</ModalForm>
		</LayoutDashboard>
	);
}
