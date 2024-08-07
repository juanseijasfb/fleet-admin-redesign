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
import useSearch from "@/hooks/useSearch";
import { useGetBrokerList } from "@/hooks/api/useGetBroker";

export default function index() {
	const { listBroker, isLoadingBroker } = useGetBrokerList();

	const { search, debounced, handleSearch } = useSearch("carrier");
	const { carriers, isLoading } = useGetCarriers(debounced);
	const modal = useDisclosure();
	const modalRestriction = useDisclosure();
	const [companyName, setCompanyName] = useState("");
	const { createCarrier, isPending } = useCreateCarrier(() => {
		modal.onClose();
	});
	const handlerModalRestriction = (e: any) => {
		setCompanyName(e[0].carrier);
		modalRestriction.onOpen();
	};
	const handleSubmit = (values: any) => {
		console.log(values);
		modalRestriction.onClose();
	};
	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Carriers"
				addButtonText="Create Carrier"
				placeholderSearch="Search Carrier"
				onChangeSearch={(e) => {
					handleSearch(e.target.value);
				}}
				defaultSearch={search}
				addButtonAction={() => {
					modal.onOpen();
				}}
			/>
			<div className="px-10">
				{
					<CarrierTable
						isLoading={isLoading}
						rows={carriers ?? []}
						onMultipleSelect={(e) => handlerModalRestriction(e)}
					/>
				}
			</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddCarrierForm
					isLoading={isPending}
					onSubmit={(values) => createCarrier(values)}
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalRestriction.isOpen}
				onOpenChange={modalRestriction.onOpenChange}
			>
				<AddRestrictionCarrier
					onClose={() => modalRestriction.onClose()}
					isLoading={isLoadingBroker}
					onSubmit={(values) => handleSubmit(values)}
					companyName={companyName}
					listBroker={listBroker}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
