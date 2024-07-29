import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "react-modern-drawer/dist/index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<Component {...pageProps} />
				<Toaster
				position="top-right"
				reverseOrder={false}
				gutter={8}
				>
				</Toaster>
			</UserProvider>
		</QueryClientProvider>
	);
}
