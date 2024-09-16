import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import DriverTable from "@/components/driversTable";
import useGetDrivers from "@/hooks/api/useGetDrivers";
import React, { useEffect, useState } from "react";
import { type Selection, useDisclosure } from "@nextui-org/react";
import ModalForm from "@/components/ModalForm";
import AddDriverForm from "@/components/forms/AddDriverForm";
import useCreateDriver from "@/hooks/api/useCreateDriver";
import UpdateDriverForm, {
	type UpdateDriverValues,
} from "@/components/forms/UpdateDriverForm";
import type { ValuesFormAddRestriction } from "@/components/forms/AddRestrictionDriverForm";
import AddRestrictionDriverForm from "@/components/forms/AddRestrictionDriverForm";
import type { Driver, GetRestriccionResponseAPI } from "@/utils/types";
import {
	useDisableDriver,
	useEnableDriver,
} from "@/hooks/api/useChangeStatusDriver";
import useSearch from "@/hooks/useSearch";
import {
	useAddRestriccion,
	useRemoveRestriccion,
} from "@/hooks/api/useChangeRestrictions";
import { useGetRestriccionDriver } from "@/hooks/api/useGetRestriccionDriver";
import ShowRestrictions from "@/components/forms/ShowRestriccions";
import toast from "react-hot-toast";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

export default function index() {
	const { search, handleSearch, debounced } = useSearch("drivers");

	const {
		driversInfinite,
		driversAll,
		isLoading,
		fetchNextPage,
		hasNextPage,
		refetchDrivers,
	} = useGetDrivers(debounced);
	const [selectedDriverId, setSelectedDriverId] = useState<string>("0");
	const [selectedDriverName, setSelectedDriverName] = useState<string>("");
	const [selectedDriver, setSelectedDriver] = useState<Driver[]>([]);
	const { disableDriver } = useDisableDriver(() =>
		toast.success("Disabled successfully"),
	);
	const { enableDriver } = useEnableDriver(() =>
		toast.success("Enabled successfully"),
	);
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
	const modal = useDisclosure();
	const modalUpdate = useDisclosure();
	const modalShowRestrictions = useDisclosure();
	const modalRestriction = useDisclosure();
	const { createDriver, isPending } = useCreateDriver(() => {
		modal.onClose();
	});
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [isDisable, setIsDisable] = useState<boolean>(false);
	const [isEnable, setIsEnable] = useState<boolean>(false);
	const [btnMultiAction, setBtnMultiAction] = useState<boolean>(false);
	const { addRestriccion, addRPending } = useAddRestriccion(() => {
		modalRestriction.onClose();
		toast.success("Restriction added successfully");
	}, "driver");
	const { removeRestriccion, isPendingRemove } = useRemoveRestriccion(() => {
		modalShowRestrictions.onClose();
		toast.success("Restriction removed successfully");
	});
	const {
		restriccionsDrivers,
		isLoadingRestriccions,
		refetchRestriccionsDrivers,
	} = useGetRestriccionDriver(selectedDriverName);

	const handleAction = (optionSelect: string, e?: Driver[]) => {
		switch (optionSelect) {
			case "edit":
				e && setSelectedDriver(e);
				modalUpdate.onOpen();
				break;
			case "disable":
				setIsDisable(true);
				e && setSelectedDriverId(e[0].id.toString());
				break;
			case "enable":
				setIsEnable(true);
				e && setSelectedDriverId(e[0].id.toString());
				break;
			case "showRestrictions":
				refetchRestriccionsDrivers();
				e && setSelectedDriverName(e[0].firstName);
				modalShowRestrictions.onOpen();
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		selectedIds.length > 0 || Number.isNaN(selectedIds[0])
			? setBtnMultiAction(true)
			: setBtnMultiAction(false);
	}, [selectedIds]);

	useEffect(() => {
		if (isDisable) {
			if (selectedIds.some(Number.isNaN)) {
				disableDriver(driversAll?.map((d) => d.id).join(",") || "0");
			} else {
				disableDriver(
					selectedIds.length > 1 ? selectedIds.join(",") : selectedDriverId,
				);
			}
		}
		if (isEnable) {
			if (selectedIds.some(Number.isNaN)) {
				enableDriver(driversAll?.map((d) => d.id).join(",") || "0");
			} else {
				enableDriver(
					selectedIds.length > 1 ? selectedIds.join(",") : selectedDriverId,
				);
			}
		}
		refetchDrivers();
		setSelectedDriverId("0");
		setIsDisable(false);
		setIsEnable(false);
		setBtnMultiAction(false);
	}, [isDisable, isEnable]);

	const handleSubmit = (e: any) => {
		if (e.subjectValue.length > 1) {
			for (const i of e.subjectValue) {
				addRestriccion({
					subject: e.subject,
					state: e.state,
					type: e.type,
					subjectValue: i,
					typeValue: e.typeValue,
					validUntil: e.validUntil,
				});
			}
		} else if (e.subjectValue.length === 0) {
			addRestriccion({
				subject: e.subject,
				state: e.state,
				type: e.type,
				subjectValue: e.subjectValue[0],
				typeValue: e.typeValue,
				validUntil: e.validUntil,
			});
		}
	};

	const drivers = driversInfinite?.pages.flatMap((page) => page.data) || [];
	const driversList = drivers?.map((e) => ({
		label: e.firstName?.replace(/,/g, " "),
		value: e.firstName,
	}));

	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Drivers"
				addButtonText="Create Driver"
				placeholderSearch="Search Driver"
				showButton={selectedKeys === "all" || selectedKeys.size > 0}
				actionButtonText="Create Restriction"
				searchBox={
					<ReactSearchAutocomplete<Driver>
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
						items={driversAll || []}
						resultStringKeyName="firstName"
						onSelect={(e) => {
							handleSearch(e.firstName);
						}}
						formatResult={(item: Driver) =>
							item && (
								<div>
									<div className="flex items-center gap-2">
										<span className="text-sm ">{item.firstName}</span>
									</div>
									<span className="text-xs text-gray-500">{item.email}</span>
								</div>
							)
						}
						onClear={(e: Driver) => handleSearch("")}
						fuseOptions={{
							keys: ["firstName", "lastName", "email", "mcNumber", "carrier"],
						}}
					/>
				}
				multiActionBtn={btnMultiAction}
				onMultipleSelect={(optionSelect) => handleAction(optionSelect)}
				addButtonAction={() => {
					modal.onOpen();
				}}
				addButtonRestriction={() => {
					modalRestriction.onOpen();
				}}
				actionButton={() => {
					const driversIds = Array.from(selectedKeys) as string[];
					const selectedDrivers = drivers?.filter((driver) =>
						driversIds.includes(driver.id.toString()),
					);
				}}
			/>

			<div className="px-10 max-w-[100%]">
				<DriverTable
					isLoading={isLoading}
					drivers={drivers ?? []}
					onMultipleSelect={(selectedDriver: Driver[], optionSelect: string) =>
						handleAction(optionSelect, selectedDriver)
					}
					listDriversId={(e) => setSelectedIds(e)}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					showMultipleSelect={btnMultiAction}
				/>
			</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddDriverForm
					type="create"
					isLoading={isPending}
					onSubmit={(values) => {
						createDriver(values);
					}}
					driverEmail={driversAll?.map((d) => d.email) ?? []}
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalUpdate.isOpen}
				onOpenChange={modalUpdate.onOpenChange}
			>
				<UpdateDriverForm
					defaultValues={selectedDriver}
					isLoading={isPending}
					onSubmit={(values) => {
						console.log(values);
						modalUpdate.onClose();
					}}
					driverEmail={driversAll?.map((d) => d.email) ?? []}
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalRestriction.isOpen}
				onOpenChange={modalRestriction.onOpenChange}
			>
				<AddRestrictionDriverForm
					onClose={modalRestriction.onClose}
					onSubmit={(e: ValuesFormAddRestriction) => handleSubmit(e)}
					driverList={driversList ?? []}
					isLoading={addRPending}
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalShowRestrictions.isOpen}
				onOpenChange={modalShowRestrictions.onOpenChange}
			>
				<ShowRestrictions
					onClose={modalShowRestrictions.onClose}
					onSubmit={(e: GetRestriccionResponseAPI) =>
						removeRestriccion({
							subject: e.Subject,
							type: e.Type,
							subjectValue: e.SubjectValue,
							typeValue: e.TypeValue,
						})
					}
					isLoading={isPendingRemove}
					restriccionDriverList={restriccionsDrivers ?? []}
					nameDriver={selectedDriverName.replace(/,/g, " ")}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
