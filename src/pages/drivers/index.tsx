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
import { Driver } from "@/utils/types";
import { useDisableDriver, useEnableDriver } from "@/hooks/api/useChangeStatusDriver";

export default function index() {
	const { isLoading, isError, drivers ,refetchDrivers } = useGetDrivers();
	const [selectedDriverId, setSelectedDriverId] = useState<number>(0);
	const [optionSelected, setOptionSelect] = useState<string>(); 
	const [selectedDriver, setSelectedDriver] = useState<UpdateDriverValues[]>([]);
	const { disableDriver } = useDisableDriver(selectedDriverId);
	const { enableDriver } = useEnableDriver(selectedDriverId);
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
	const modal = useDisclosure();
	const modalUpdate = useDisclosure();
	const modalRestriction = useDisclosure();
	const { createDriver, isPending } = useCreateDriver(() => {
		modal.onClose();
	});

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
		setOptionSelect(optionSelect)
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
		default:
			break;
		}
	};
	const handlerRestriction = (e: AddRestrictionDriverValues) => {
		console.log(e);
		modalRestriction.onClose();
	};

	const driversList = drivers?.map((e) => ({
		label: e.firstName.replace(/,/g," "),
		value: e.id
	}));

	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Drivers"
				addButtonText="Create Driver"
				placeholderSearch="Search Driver"
				showButton={selectedKeys === "all" || selectedKeys.size > 0}
				actionButtonText="Modify Restrictions"
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
					rows={drivers ?? []}
					selectedKeys={selectedKeys}
					setSelectedKeys={setSelectedKeys}
					onMultipleSelect={(selectedDriver: Driver[], optionSelect:string) => handlerMultipleSelect(selectedDriver, optionSelect)}
				/>
			</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddDriverForm
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
					onSubmit={(e: AddRestrictionDriverValues) => handlerRestriction(e)}
					driverList={driversList ?? []}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
