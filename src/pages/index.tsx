import Image from "next/image";
import { Inter } from "next/font/google";
import { Button, Spinner } from "@nextui-org/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import useAuth from "@/hooks/useAuth";
import LayoutDashboard from "@/components/LayoutDashboard";

export default function Home() {
	return (
		<LayoutDashboard>
			<Button
				onClick={() => {
					window.location.href = "/api/auth/login";
				}}
			>
				Login
			</Button>
		</LayoutDashboard>
	);
}
