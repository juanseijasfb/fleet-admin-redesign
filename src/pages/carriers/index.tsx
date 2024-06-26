import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";

export default function index() {
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
			<Button
				onClick={() => {
					window.location.href = "/api/auth/login";
				}}
			>
				Login
			</Button>
			<ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
				<div>
					<h1>Modal</h1>
				</div>
			</ModalForm>
		</LayoutDashboard>
	);
}
