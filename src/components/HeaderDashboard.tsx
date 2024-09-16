import { DataSelectAutocomplete } from "@/utils/types";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
	HiOutlinePlus,
	HiOutlineSearch,
	HiPencil,
	HiPencilAlt,
} from "react-icons/hi";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

interface HeaderDashboardProps {
	title: string;
	addButtonText?: string;
	addButtonAction?: () => void;
	placeholderSearch?: string;
	onChangeSearch?: (e: string) => void;
	showButton?: boolean;
	multiActionBtn?: boolean;
	actionButton?: () => void;
	addButtonRestriction?: () => void;
	actionButtonText?: string;
	defaultSearch?: string;
	onMultipleSelect: (optionSelect: string) => void;
	searchBox?: React.ReactNode;
}
export default function HeaderDashboard({
	title,
	addButtonText,
	addButtonAction,
	showButton,
	actionButton,
	multiActionBtn,
	addButtonRestriction,
	actionButtonText,
	onMultipleSelect,
	searchBox,
}: HeaderDashboardProps) {
	const [selected, setSelected] = useState<DataSelectAutocomplete>();

	return (
		<div className="md:h-20 px-10 flex md:flex-row flex-col gap-8 md:gap-0 justify-between items-center">
			<h1 className="font-bold text-2xl">{title}</h1>
			<div className={"flex items-center gap-4"}>
				{multiActionBtn && (
					<Dropdown>
						<DropdownTrigger>
							<Button
								className="min-w-24 max-h-8"
								color="primary"
								variant="flat"
							>
								Multi Action
							</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem onClick={() => onMultipleSelect("enable")}>
								Enable
							</DropdownItem>
							<DropdownItem onClick={() => onMultipleSelect("disable")}>
								Disable
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				)}
				{showButton && (
					<Button
						color="primary"
						className="min-w-40 mx-auto"
						onClick={actionButton}
					>
						<span>{actionButtonText}</span>
					</Button>
				)}
				{searchBox && <div className="w-[250px] z-50">{searchBox}</div>}
				{actionButtonText && (
					<Button
						onClick={() => addButtonRestriction?.()}
						color="primary"
						className="min-w-48 mx-auto"
					>
						<HiPencil size={18} />
						<span>{actionButtonText}</span>
					</Button>
				)}
				{addButtonText && (
					<Button
						onClick={() => addButtonAction?.()}
						color="primary"
						className="min-w-40 mx-auto"
					>
						<HiOutlinePlus size={18} />
						<span>{addButtonText}</span>
					</Button>
				)}
			</div>
		</div>
	);
}
