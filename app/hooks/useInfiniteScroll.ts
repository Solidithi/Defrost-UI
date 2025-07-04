import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
	threshold?: number;
	rootMargin?: string;
}

export const useInfiniteScroll = ({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	threshold = 0.1,
	rootMargin = "100px",
}: UseInfiniteScrollProps) => {
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[hasNextPage, isFetchingNextPage, fetchNextPage]
	);

	useEffect(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			threshold,
			rootMargin,
		});

		const currentRef = loadMoreRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [handleIntersection, threshold, rootMargin]);

	return { loadMoreRef };
};
