import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import AddCarrierForm from "@/components/forms/AddCarrierForm";
import useCreateCarrier from "@/hooks/api/useCreateCarrier";
import CarrierTable from "@/components/carrierTable";
import useGetCarriers from "@/hooks/api/useGetCarriers";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import AddRestrictionCarrier, { CarrierTableValues } from "@/components/forms/AddRestrictionCarrier";
import useSearch from "@/hooks/useSearch";
import { useGetBrokerList } from "@/hooks/api/useGetBroker";
import toast from "react-hot-toast";
import { useAddRestriccion } from "@/hooks/api/useChangeRestrictions";

export default function index() {
	const { listBroker, isLoadingBroker } = useGetBrokerList();

	const { search, debounced, handleSearch } = useSearch("carrier");
	const { carriersInfinite, carrierAll, isLoading, fetchNextPage, hasNextPage } = useGetCarriers(debounced);
	const { addRestriccion, addRPending } = useAddRestriccion(() => { modalRestriction.onClose(); toast.success('Restriction added successfully');}, "carrier");
	const modal = useDisclosure();
	const modalRestriction = useDisclosure();
	const [carrierSelected, setCarrierSelected] = useState<CarrierTableValues>();
	const { createCarrier, isPending } = useCreateCarrier(() => {
		modal.onClose();
	});
	const handlerModalRestriction = (e: any) => {
		setCarrierSelected(e[0]);
		modalRestriction.onOpen();
	};
	const carriers = carriersInfinite?.pages.flatMap(page => page.data) || [];
	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Carriers"
				addButtonText="Create Carrier"
				placeholderSearch="Search Carrier"
				onMultipleSelect={(e) => console.log(e)}
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
						carriers={carriers ?? []}
						onMultipleSelect={(e) => handlerModalRestriction(e)}
						fetchNextPage={fetchNextPage}
						hasNextPage={hasNextPage}
					/>
				}
			</div>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<AddCarrierForm
					isLoading={isPending}
					onSubmit={(values) => createCarrier(values)}
					carrierMc={carrierAll?.map((c) => c.mcNumber.toString()) ?? []}
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalRestriction.isOpen}
				onOpenChange={modalRestriction.onOpenChange}
			>
				<AddRestrictionCarrier
					onClose={() => modalRestriction.onClose()}
					isLoading={addRPending}
					onSubmit={(e) => addRestriccion({subject: e.subject, type: e.type,subjectValue: e.subjectValue,typeValue: e.typeValue,validUntil: e.validUntil})}
					carrierSelected={carrierSelected}
					listBroker={listBroker}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
