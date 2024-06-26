import { Input } from "@nextui-org/react";
import classNames from "classnames";

export interface TextInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	value?: string | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	register?: any;
	isValid?: boolean;
	errorMessage?: string;
	label?: string;
}

export default function TextInput({
	register,
	errorMessage,
	isValid = true,

	...props
}: TextInputProps) {
	return (
		<div
			className={classNames({
				"h-16 md:h-16  w-full": !props.className,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				[props.className!]: props.className,
			})}
		>
			<Input
				isInvalid={!isValid}
				errorMessage={!isValid && errorMessage}
				label={props.label}
				name={props.name}
				type={props.type}
				placeholder={props.placeholder}
				onChange={props.onChange}
				value={props.value && props.value}
				{...register}
			/>
		</div>
	);
}
