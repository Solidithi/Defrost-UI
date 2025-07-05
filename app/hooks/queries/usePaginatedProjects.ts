import { useQuery } from "@tanstack/react-query";
import { projectsApi, ProjectsResponse } from "@/app/lib/queries/projects";

interface UsePaginatedProjectsProps {
	page: number;
	limit: number;
	search?: string;
	enabled?: boolean;
}

export function usePaginatedProjects({
	page,
	limit,
	search,
	enabled = true,
}: UsePaginatedProjectsProps) {
	return useQuery({
		queryKey: ["projects-paginated", page, limit, search],
		queryFn: () => projectsApi.getPaginatedProjects(page, limit, search),
		enabled,
		placeholderData: (previousData) => previousData, // Keep previous data while fetching new page (TanStack Query v5)
		staleTime: 30000, // Data stays fresh for 30 seconds
		gcTime: 5 * 60 * 1000, // Garbage collection time for 5 minutes (replaces cacheTime in v5)
	});
}
