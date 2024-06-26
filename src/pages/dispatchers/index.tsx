import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import DispatcherTable from "@/components/dispatcherTable";
import useGetDispatchers from "@/hooks/api/useGetDispatcher";
import { Button } from "@nextui-org/react";
import React from "react";

export default function index() {
	const { dispatchers } = useGetDispatchers();
	return (
		<LayoutDashboard>
			<HeaderDashboard
				title="Dispatchers"
				addButtonText="Create Dispatcher"
				placeholderSearch="Search Dispatcher"
			/>
			<div className="px-10">
				{<DispatcherTable rows={dispatchers ?? []} />}
			</div>
		</LayoutDashboard>
	);
}
