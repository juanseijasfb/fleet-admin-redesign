import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";
import React from "react";

interface ModalFormProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	children?: React.ReactNode;
}
export default function ModalForm({
	isOpen,
	onOpenChange,
	children,
}: ModalFormProps) {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalBody>{children}</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
