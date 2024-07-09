import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import React from "react";
import { HiOutlinePlus, HiOutlineSearch, HiPencil, HiPencilAlt } from "react-icons/hi";

interface HeaderDashboardProps {
	title: string;
	addButtonText?: string;
	addButtonAction?: () => void;
	placeholderSearch?: string;
	onChangeSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	showButton?: boolean;
	actionButton?: () => void;
	addButtonRestriction?: () => void;
	actionButtonText?: string;
}
export default function HeaderDashboard({
	title,
	addButtonText,
	addButtonAction,
	placeholderSearch,
	onChangeSearch,
	showButton,
	actionButton,
	addButtonRestriction,
	actionButtonText,
}: HeaderDashboardProps) {
	const router = useRouter();
	return (
		<div className="md:h-20 px-10 flex md:flex-row flex-col gap-8 md:gap-0 justify-between items-center">
			<h1 className="font-bold text-2xl">{title}</h1>
			<div className={"flex gap-4"}>
				{showButton && (
					<Button
						color="primary"
						className="min-w-40 mx-auto"
						onClick={actionButton}
					>
						<span>{actionButtonText}</span>
					</Button>
				)}
				{placeholderSearch && (
					<Input
						placeholder={placeholderSearch}
						onChange={onChangeSearch}
						startContent={<HiOutlineSearch size={18} />}
					/>
				)}
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
