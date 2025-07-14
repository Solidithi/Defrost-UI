import { useInfiniteQuery } from "@tanstack/react-query";
import { type ProjectFilters, projectsApi } from "@/app/lib/queries/projects";

// Query keys for consistent caching
export const projectsKeys = {
	all: ["projects"] as const,
	list: (filters?: Record<any, any>) =>
		[...projectsKeys.all, filters] as const,
	details: () => [...projectsKeys.all, "detail"] as const,
	detail: (id: string) => [...projectsKeys.details(), id] as const,
	search: (query: string) => [...projectsKeys.all, "search", query] as const,
};

// Fetch all projects with infinite scrolling
export const useProjects = (filters?: ProjectFilters) => {
	return useInfiniteQuery({
		queryKey: projectsKeys.list(filters),
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
