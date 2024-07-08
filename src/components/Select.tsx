import { SelectItem, Select as S } from "@nextui-org/react";
import React from "react";

export interface SelectProps {
	size?: "sm" | "md" | "lg" | undefined;
	name?: string;
	className?: string;
	label?: string;
	options: { value: string | number; label: string }[];
	isValid?: boolean;
	errorMessage?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	register?: any;
	value?: string | number;
	isLoading?: boolean;
	textAlign?: "center" | "left";
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	placeholder: string;
	defaultValue?: string | number;
}
export default function Select({
	className,
	textAlign = "center",
	placeholder,
	options,
	isLoading,
	isValid = true,
	onChange,
	errorMessage,
	size = "sm",
	register,
	name,
	value,
	label,
	defaultValue
}: SelectProps) {
	return (
		<div>
			<S
				label={label}
				name={name}
				size={size}
				isLoading={isLoading}
				variant="faded"
				radius="lg"
				classNames={{
					value: `text-${textAlign}`,
				}}
				selectedKeys={value ? [value] : undefined}
				defaultSelectedKeys={defaultValue}
				className={className}
				onChange={onChange}
				errorMessage={!isValid && errorMessage}
				isInvalid={!isValid}
				placeholder={placeholder}
				{...register}
			>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</S>
		</div>
	);
}
