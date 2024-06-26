import useWindowResize from "@/hooks/useWindowResize";
import React from "react";
import useToggle from "@/hooks/useToggle";
import Drawer from "react-modern-drawer";
import DrawerContent from "./DrawerContent";
import { AiOutlineMenu } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

import { User } from "@nextui-org/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import useAuth from "@/hooks/useAuth";

interface LayoutDashboardProps {
	children: React.ReactNode;
}

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
	const { isDesktop, isMobile } = useWindowResize();
	const { state, toggle } = useToggle(false);
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="h-screen w-full justify-center items-center flex flex-col bg-primary zoom-in-out ">
				<img
					src="/logo.png"
					alt="Logo"
					className="w-full h-20 object-contain"
				/>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="h-20 bg-primary w-full md:px-8 flex items-center justify-between gap-6 px-6 object-fill">
				<div className="flex items-center gap-8">
					<AiOutlineMenu
						onClick={toggle}
						className="text-2xl text-white cursor-pointer"
					/>

					<img
						src="/logo.png"
						alt="Logo"
						className="w-40 h-20 object-contain"
					/>
				</div>
				<div>
					{!isLoading && user && isDesktop && (
						<User
							className="text-white"
							avatarProps={{
								src: user.picture ?? undefined,
							}}
							name={user.name}
							description={
								<span className="text-white" style={{ fontSize: "0.75rem" }}>
									{user.email}
								</span>
							}
						/>
					)}
				</div>
			</div>
			{/* {isDesktop && (
				<div
					style={{
						position: "relative",
						display: "flex",
						minHeight: "calc(100vh - 5rem)",
					}}
				>
					<div className="min-h-full bg-gray-200 w-[20%] border-2 ">
						<DrawerContent />
					</div>
					<div
						style={{
							position: "relative",
						}}
						className="w-[80%]"
					>
						{children}
					</div>
				</div>
			)} */}
			<>
				<Drawer
					open={state}
					onClose={toggle}
					direction="left"
					className="relative"
				>
					<div className="absolute right-2 top-2">
						<IoClose
							onClick={toggle}
							className="text-2xl text-primary cursor-pointer"
						/>
					</div>
					<div className="px-4 pt-8">
						{!isLoading && user && isMobile && (
							<User
								className="text-black text-xs"
								avatarProps={{
									src: user.picture ?? undefined,
								}}
								name={user.name}
								description={
									<span className="text-black" style={{ fontSize: "0.75rem" }}>
										{user.email}
									</span>
								}
							/>
						)}
					</div>

					<DrawerContent />
				</Drawer>
				<div className="w-full">{children}</div>
			</>
			{/* {/* */}
			{/*  */} {/* {children} */}
		</div>
	);
}
