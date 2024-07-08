import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import AddCarrierForm from "@/components/forms/AddCarrierForm";
import useCreateCarrier from "@/hooks/api/useCreateCarrier";
import CarrierTable from "@/components/carrierTable";
import useGetCarriers from "@/hooks/api/useGetCarriers";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import AddRestrictionCarrier from "@/components/forms/AddRestrictionCarrier";

export default function index() {
	const { carriers } = useGetCarriers();
	const modal = useDisclosure();
	const modalRestriction = useDisclosure();
	const [companyName, setCompanyName] = useState("");
	const { createCarrier, isPending } = useCreateCarrier(() => {
		modal.onClose();
	});
	const handlerModalRestriction = (e:any) => {
		console.log(e[0].mcNumber)
		setCompanyName(e[0].carrier)
		modalRestriction.onOpen();
	}

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
			<div className="px-10">{<CarrierTable rows={carriers ?? []} onMultipleSelect={(e) => handlerModalRestriction(e)}/>}</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddCarrierForm
					isLoading={isPending}
					onSubmit={(values) => createCarrier(values)}
				/>
			</ModalForm>
			<ModalForm isOpen={modalRestriction.isOpen} onOpenChange={modalRestriction.onOpenChange}>
				<AddRestrictionCarrier
					onClose={() => modalRestriction.onClose()}
					isLoading={isPending}
					onSubmit={(values) => console.log(values)}
					companyName={companyName}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
