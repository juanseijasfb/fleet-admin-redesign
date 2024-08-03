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
import type { AddRestrictionDriverValues } from "@/components/forms/AddRestrictionDriverForm";
import AddRestrictionDriverForm from "@/components/forms/AddRestrictionDriverForm";
import type { Driver, GetRestriccionResponseAPI } from "@/utils/types";
import {
	useDisableDriver,
	useEnableDriver,
} from "@/hooks/api/useChangeStatusDriver";
import useSearch from "@/hooks/useSearch";
import { useAddRestriccion, useRemoveRestriccion } from "@/hooks/api/useChangeRestrictions";
import { useGetRestriccionDriver } from "@/hooks/api/useGetRestriccionDriver";
import ShowRestrictions from "@/components/forms/ShowRestriccions";
import toast from 'react-hot-toast';

export default function index() {
	const { search, handleSearch, debounced } = useSearch("drivers");

	const { driversInfinite, isLoading, fetchNextPage, hasNextPage, refetchDrivers } = useGetDrivers(debounced);
	const [selectedDriverId, setSelectedDriverId] = useState<number>(0);
	const [selectedDriverName, setSelectedDriverName] = useState<string>("");
	const [optionSelected, setOptionSelect] = useState<string>();
	const [selectedDriver, setSelectedDriver] = useState<UpdateDriverValues[]>(
		[],
	);
	const { disableDriver } = useDisableDriver(selectedDriverId);
	const { enableDriver } = useEnableDriver(selectedDriverId);
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
	const modal = useDisclosure();
	const modalUpdate = useDisclosure();
	const modalShowRestrictions = useDisclosure();
	const modalRestriction = useDisclosure();
	const { createDriver, isPending } = useCreateDriver(() => {
		modal.onClose();
	});
	const { addRestriccion,addRPending } = useAddRestriccion(() => { modalRestriction.onClose(); toast.success('Restriction added successfully');})
	const { removeRestriccion, isPendingRemove } = useRemoveRestriccion(() => { modalShowRestrictions.onClose();toast.success('Restriction removed successfully');});
	const { restriccionsDrivers, isLoadingRestriccions, refetchRestriccionsDrivers } = useGetRestriccionDriver(selectedDriverName);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		switch (optionSelected) {
			case "disable":
				disableDriver();
				refetchDrivers();
				break;
			case "enable":
				enableDriver();
				refetchDrivers();
				break;
			default:
				refetchDrivers();
				break;
		}
		setOptionSelect("");
		setSelectedDriverId(0);
	}, [optionSelected, selectedDriverId]);

	const handlerMultipleSelect = (e: any[], optionSelect: string) => {
		setOptionSelect(optionSelect);
		switch (optionSelect) {
			case "edit":
				setSelectedDriver(e);
				modalUpdate.onOpen();
				break;
			case "disable":
				setSelectedDriverId(e[0].id);
				break;
			case "enable":
				setSelectedDriverId(e[0].id);
				break;
			case "showRestrictions":
				refetchRestriccionsDrivers();
				setSelectedDriverName(e[0].firstName);
				modalShowRestrictions.onOpen();
				break;
			default:
				break;
		}
	};

	const drivers = driversInfinite?.pages.flatMap(page => page.data) || [];
	const driversList = drivers?.map((e) => ({
		label: e.firstName.replace(/,/g," "),
		value: e.firstName
	}));

	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Drivers"
				addButtonText="Create Driver"
				placeholderSearch="Search Driver"
				showButton={selectedKeys === "all" || selectedKeys.size > 0}
				actionButtonText="Modify Restrictions"
				defaultSearch={search}
				onChangeSearch={(e) => handleSearch(e.target.value)}
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
						handlerMultipleSelect(selectedDriver, optionSelect)
					}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
				/>
			</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddDriverForm
					type="create"
					isLoading={isPending}
					onSubmit={(values) => {
						createDriver(values);
					}}
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
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalRestriction.isOpen}
				onOpenChange={modalRestriction.onOpenChange}
			>
				<AddRestrictionDriverForm
					onClose={modalRestriction.onClose}
					onSubmit={(e: AddRestrictionDriverValues) => addRestriccion({subject: e.subject,state: e.state, type: e.type,subjectValue: e.subjectValue,typeValue: e.typeValue,validUntil: e.validUntil})}
					driverList={driversList ?? []}
					isLoading={addRPending}
				/>
			</ModalForm>
			<ModalForm isOpen={modalShowRestrictions.isOpen} onOpenChange={modalShowRestrictions.onOpenChange}>
				<ShowRestrictions
					onClose={modalShowRestrictions.onClose}
					onSubmit={(e: GetRestriccionResponseAPI) => removeRestriccion({subject: e.Subject,type: e.Type,subjectValue: e.SubjectValue,typeValue: e.TypeValue})}
					isLoading={isPendingRemove}
					restriccionDriverList={restriccionsDrivers ?? []}
					nameDriver={selectedDriverName.replace(/,/g," ")}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
