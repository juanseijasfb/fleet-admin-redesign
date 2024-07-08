import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import DriverTable from "@/components/driversTable";
import useGetDrivers from "@/hooks/api/useGetDrivers";
import React, { useState } from "react";
import { Selection, useDisclosure } from "@nextui-org/react";
import ModalForm from "@/components/ModalForm";
import AddDriverForm from "@/components/forms/AddDriverForm";
import useCreateDriver from "@/hooks/api/useCreateDriver";
import UpdateDriverForm, { UpdateDriverValues } from "@/components/forms/UpdateDriverForm";

export default function index() {
	const { isLoading, isError, drivers } = useGetDrivers();
	const [showButton, setShowButton] = React.useState(false);
	const [ selectedDriver, setSelectedDriver] = useState<UpdateDriverValues[]>([]);
	const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
	const modal = useDisclosure();
	const modalUpdate = useDisclosure();
	const { createDriver, isPending } = useCreateDriver(() => {
		modal.onClose();
	});

	const handlerModalUpdate = (e: any) => {
		setSelectedDriver(e)
		modalUpdate.onOpen();
	}

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
					onMultipleSelect={handlerModalUpdate}
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
			<ModalForm isOpen={modalUpdate.isOpen} onOpenChange={modalUpdate.onOpenChange}>
				<UpdateDriverForm 
					defaultValues={selectedDriver}
					isLoading={isPending}
					onSubmit={(values) => {
						console.log(values);
						modalUpdate.onClose();
					}}/>
			</ModalForm>
		</LayoutDashboard>
	);
}
