import { useQuery } from "@tanstack/react-query";
import { projectsApi, ProjectFilters } from "@/app/lib/queries/projects";

export function usePaginatedProjects(
	page: number,
	limit: number,
	enabled = true,
	filters: ProjectFilters = {}
) {
	return useQuery({
		queryKey: ["projects-paginated", page, limit, filters],
		queryFn: () => projectsApi.getPaginatedProjects(page, limit, filters),
		enabled,
		placeholderData: (previousData) => previousData, // Keep previous data while fetching new page (TanStack Query v5)
		staleTime: 30000, // Data stays fresh for 30 seconds
		gcTime: 5 * 60 * 1000, // Garbage collection time for 5 minutes (replaces cacheTime in v5)
	});
}
