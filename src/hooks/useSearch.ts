import React, { useEffect } from "react";

export function useDebounce<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

	React.useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
export default function useSearch(key: string) {
	const [search, setSearch] = React.useState("");
	const debounced = useDebounce(search, 500);

	const handleSearch = (value: string) => {
		setSearch(value);
		if (typeof window !== "undefined") {
			const parmas = new URLSearchParams(window.location.search);

			if (value.length > 0) {
				parmas.set(key, value);
			} else {
				parmas.delete(key);
			}
			window.history.pushState({}, "", `?${parmas.toString()}`);
		}
	};

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		const parmas = new URLSearchParams(window.location.search);
		const search = parmas.get(key);
		if (search) {
			setSearch(search);
		}
	}, [typeof window !== "undefined" ? window.location.search : ""]);

	return {
		search: search,
		debounced,
		handleSearch,
	};
}
