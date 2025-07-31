import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { type ProjectFilters, projectsApi } from "@/app/lib/queries/projects";
import { Address } from "viem";

// Query keys for consistent caching
export const projectsKeys = {
	all: ["projects"] as const,
	listInfinite: (filters?: Record<any, any>) =>
		[...projectsKeys.all, "infinite", filters] as const,
	listPaginated: (page: number, limit: number, filters?: Record<any, any>) =>
		[...projectsKeys.all, "paginated", page, limit, filters] as const,
	minePaginated: (
		projectOwnerAddress: Address,
		page: number,
		limit: number,
		filters?: Record<any, any>
	) =>
		[
			...projectsKeys.all,
			"minePaginated",
			projectOwnerAddress,
			page,
			limit,
			filters,
		] as const,
	details: () => [...projectsKeys.all, "details"] as const,
	detail: (id: string) => [...projectsKeys.details(), id] as const,
	search: (query: string) => [...projectsKeys.all, "search", query] as const,
};

// Fetch all projects with infinite scrolling
export const useProjects = (filters?: ProjectFilters) => {
	return useInfiniteQuery({
		queryKey: projectsKeys.listInfinite(filters),
		queryFn: ({ pageParam = 1 }) =>
			projectsApi.getAllProjects(pageParam, undefined, filters),
		getNextPageParam: (lastPage) => {
			// Check if there are more pages
			const currentPage = lastPage.page;
			const totalPages = Math.ceil(lastPage.total / lastPage.limit);
			return currentPage < totalPages ? currentPage + 1 : undefined;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		initialPageParam: 1,
	});
};

export function usePaginatedProjects(
	page: number,
	limit: number,
	enabled = true,
	filters: ProjectFilters = {}
) {
	return useQuery({
		queryKey: projectsKeys.listPaginated(page, limit, filters),
		queryFn: () => projectsApi.getPaginatedProjects(page, limit, filters),
		enabled,
		placeholderData: (previousData) => previousData, // Keep previous data while fetching new page (TanStack Query v5)
		staleTime: 30000, // Data stays fresh for 30 seconds
		gcTime: 5 * 60 * 1000, // Garbage collection time for 5 minutes (replaces cacheTime in v5)
	});
}

// Fetch projects created by the requesting user
export const useMyProjects = (
	projectOwnerAddress: Address,
	page: number,
	limit: number,
	filters?: ProjectFilters // This isn't used now, but can be utilized later
) => {
	return useQuery({
		queryKey: projectsKeys.minePaginated(projectOwnerAddress, page, limit),
		queryFn: () =>
			projectsApi.getMyProjects(projectOwnerAddress, page, limit, {
				...filters,
			}),
		enabled: !!projectOwnerAddress, // Only run if we have a project owner address
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// // Fetch project by ID
// export const useProject = (id: string) => {
// 	return useQuery({
// 		queryKey: projectsKeys.detail(id),
// 		queryFn: () => projectsApi.getProjectById(id),
// 		enabled: !!id, // Only run if id exists
// 	});
// };

// // Search projects
// export const useSearchProjects = (query: string) => {
// 	return useQuery({
// 		queryKey: projectsKeys.search(query),
// 		queryFn: () => projectsApi.searchProjects(query),
// 		enabled: query.length > 0, // Only search if query exists
// 		staleTime: 2 * 60 * 1000, // 2 minutes for search results
// 	});
// };

// // Update project mutation
// export const useUpdateProject = () => {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: projectsApi.updateProjectDetails,
// 		onSuccess: (data) => {
// 			// Invalidate and refetch projects list
// 			queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });

// 			// Update the specific project in cache
// 			queryClient.setQueryData(
// 				projectsKeys.detail(data.project.id.toString()),
// 				data.project
// 			);
// 		},
// 		onError: (error) => {
// 			console.error("Error updating project:", error);
// 		},
// 	});
// };
