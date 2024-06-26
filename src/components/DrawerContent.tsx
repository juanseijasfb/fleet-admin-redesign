import Link from "next/link";
import React from "react";
import { BsTruck, BsHouseDoor, BsBuilding, BsPeople } from "react-icons/bs";
import classNames from "classnames";
import { CiLogout } from "react-icons/ci";
export default function DrawerContent() {
	const path = typeof window !== "undefined" ? window.location.pathname : ""
	const links = [
		{
			name: "Home",
			href: "/",
			icon: <BsHouseDoor size={25} />,
		},
		{
			name: "Drivers",
			href: "/drivers",
			icon: <BsTruck size={25} />,
		},
		{
			name: "Dispatchers",
			href: "/dispatchers",
			icon: <BsPeople size={25} />,
		},
		{
			name: "Carriers",
			href: "/carriers",
			icon: <BsBuilding size={25} />,
		},
	];
	return (
		<div className="h-full">
			<div className="flex flex-col py-8 px-4 h-[70%]">
				{links.map((link) => (
					<Link
						className={classNames(
							"py-3 my-2 flex items-center rounded-xl px-4 transition-all ease-in cursor-pointer",
							"hover:bg-gray-300",
							"hover:text-primary",
							{
								"bg-primary text-white": link.href === path,
							},
						)}
						key={link.href}
						href={link.href}
					>
						{link.icon}
						<span className="ml-4">{link.name}</span>
					</Link>
				))}
			</div>

			<div className="flex flex-col py-8 px-4">
				<a
					href="/api/auth/logout"
					className="py-3 my-2 flex items-center rounded-xl px-4 transition-all ease-in cursor-pointer text-secondary hover:scale-105 "
				>
					<CiLogout size={22} />
					<span className="ml-4">Cerrar Sesion</span>
				</a>
			</div>
		</div>
	);
}
