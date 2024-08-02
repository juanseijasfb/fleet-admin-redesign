"use client";

import { useState, useEffect } from "react";

export default function useWindowResize() {
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});
	const [isMobile, setIsMobile] = useState(false);
	const [isDesktop, setIsDesktop] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		setIsDesktop(window.innerWidth > 768);
		setIsMobile(window.innerWidth < 768);

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [windowSize.width, windowSize.height]);

	return {
		width: windowSize.width,
		height: windowSize.height,
		isMobile,
		isDesktop,
	};
}
