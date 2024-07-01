import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import AddCarrierForm from "@/components/forms/AddCarrierForm";
import useCreateCarrier from "@/hooks/api/useCreateCarrier";
import CarrierTable from "@/components/carrierTable";
import useGetCarriers from "@/hooks/api/useGetCarriers";
import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";

export default function index() {
	const { carriers } = useGetCarriers();
	const modal = useDisclosure();
	const { createCarrier, isPending } = useCreateCarrier(() => {
		modal.onClose();
	});
	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Carriers"
				addButtonText="Create Carrier"
				placeholderSearch="Search Carrier"
				addButtonAction={() => {
					modal.onOpen();
				}}
			/>
			<div className="px-10">{<CarrierTable rows={carriers ?? []} />}</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddCarrierForm
					isLoading={isPending}
					onSubmit={(values) => createCarrier(values)}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
