import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import AddCarrierForm from "@/components/forms/AddCarrierForm";
import useCreateCarrier from "@/hooks/api/useCreateCarrier";
import CarrierTable from "@/components/carrierTable";
import useGetCarriers from "@/hooks/api/useGetCarriers";
import { Button, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import AddRestrictionCarrier, {
	type CarrierTableValues,
} from "@/components/forms/AddRestrictionCarrier";
import useSearch from "@/hooks/useSearch";
import { useGetBrokerList } from "@/hooks/api/useGetBroker";
import toast from "react-hot-toast";
import { useAddRestriccion } from "@/hooks/api/useChangeRestrictions";
import ShowRestrictions from "@/components/forms/ShowRestriccions";
import type { Carrier, GetRestriccionResponseAPI } from "@/utils/types";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useGetRestricctionBroker } from "@/hooks/api/useGetRestriccionsBroker";
import ApiService from "@/services/ApiService";

export default function index() {
	const { listBroker, isLoadingBroker } = useGetBrokerList();

	const { search, debounced, handleSearch } = useSearch("carrier");
	const {
		carriersInfinite,
		carrierAll,
		isLoading,
		fetchNextPage,
		hasNextPage,
	} = useGetCarriers(debounced);
	const { addRestriccion, addRPending } = useAddRestriccion(() => {
		modalRestriction.onClose();
		toast.success("Restriction added successfully");
	}, "carrier");
	const modal = useDisclosure();
	const modalRestriction = useDisclosure();
	const modalShowRestrictions = useDisclosure();
	const [carrierSelected, setCarrierSelected] = useState<CarrierTableValues>();
	const { createCarrier, isPending } = useCreateCarrier(() => {
		modal.onClose();
	});
	const {
		restriccionesCarrier,
		isLoadingRestriccions,
		refetchRestriccionsCarrier,
	} = useGetRestricctionBroker(carrierSelected?.mcNumber);

	const handlerModalRestriction = (e: any, optionSelect: string) => {
		switch (optionSelect) {
			case "add":
				setCarrierSelected(e[0]);
				modalRestriction.onOpen();
				break;
			case "show":
				setCarrierSelected(e[0]);
				modalShowRestrictions.onOpen();
		}
	};
	const carriers = carriersInfinite?.pages.flatMap((page) => page.data) || [];
	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Carriers"
				addButtonText="Create Carrier"
				placeholderSearch="Search Carrier"
				onMultipleSelect={(e) => console.log(e)}
				onChangeSearch={(e) => handleSearch(e)}
				searchBox={
					<ReactSearchAutocomplete<Carrier>
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
						items={carrierAll || []}
						resultStringKeyName="carrier"
						onSelect={(e) => {
							handleSearch(e.carrier);
						}}
						formatResult={(item: Carrier) =>
							item && (
								<div>
									<div className="flex items-center gap-2">
										<span className="text-sm ">{item.carrier}</span>
									</div>
									<span className="text-xs text-gray-500">{item.mcNumber}</span>
								</div>
							)
						}
						onClear={(e: Carrier) => handleSearch("")}
						fuseOptions={{
							keys: ["carrier", "mcNumber"],
						}}
					/>
				}
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
						onMultipleSelect={(e, optionSelect) =>
							handlerModalRestriction(e, optionSelect)
						}
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
					onSubmit={(e) =>
						addRestriccion({
							subject: e.subject,
							type: e.type,
							subjectValue: e.subjectValue,
							typeValue: e.typeValue,
							validUntil: e.validUntil,
						})
					}
					carrierSelected={carrierSelected}
					listBroker={listBroker}
				/>
			</ModalForm>
			<ModalForm
				isOpen={modalShowRestrictions.isOpen}
				onOpenChange={modalShowRestrictions.onOpenChange}
			>
				<ShowRestrictions
					onClose={modalShowRestrictions.onClose}
					getLabel={(e) => {
						return "";
						// const api = new ApiService();
						// const broker = await api.getBrokerByMcNumber({
						// 	mcNumber: Number(e),
						// });
						// return broker.
					}}
					onSubmit={(e: GetRestriccionResponseAPI) =>
						console.log({
							subject: e.Subject,
							type: e.Type,
							subjectValue: e.SubjectValue,
							typeValue: e.TypeValue,
						})
					}
					restriccionDriverList={restriccionesCarrier || []}
					nameDriver={carrierSelected?.carrier || ""}
				/>
			</ModalForm>
		</LayoutDashboard>
	);
}
