import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import CarrierTable from "@/components/carrierTable";
import useGetCarriers from "@/hooks/api/useGetCarriers";
import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";

export default function index() {
	const { carriers } = useGetCarriers();
	const modal = useDisclosure();
	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Carriers"
				addButtonText="Create Carrier"
				placeholderSearch="Search Carrier"
				addButtonAction={() => {
					alert("Create Carrier");
				}}
			/>
			<div className="px-10">
        		{<CarrierTable rows={carriers ?? []} />}
      		</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<div>
					<h1>Modal</h1>
				</div>
			</ModalForm>
		</LayoutDashboard>
	);
}
