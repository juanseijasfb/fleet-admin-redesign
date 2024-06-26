import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useAuth() {
	const { user, error, isLoading } = useUser();
	const [loading, setLoading] = useState(isLoading);

	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			if (error) {
				window.location.href = "/api/auth/login";
			}
			if (!isLoading && !user) {
				window.location.href = "/api/auth/login";
			}
			if (user) {
				setLoading(false);
			}
		}, 1000);
	}, [user, error, isLoading]);

	return { user, isLoading: loading };
}
