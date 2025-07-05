import "@/app/lib/superjson-init";
import { EnrichedProject } from "@/app/types";
import { parse } from "superjson";

export interface ProjectsResponse {
	projects: EnrichedProject[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export const projectsApi = {
	// Fetch all projects with pagination (for infinite scroll - card view)
	getAllProjects: async (
		page: number = 1,
		limit: number = 10
	): Promise<ProjectsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		const response = await fetch(`/api/all-project?${params}`);
		if (!response.ok) {
			throw new Error("Failed to fetch projects");
		}
		return parse(await response.json());
	},

	// Fetch paginated projects with search (for table view)
	getPaginatedProjects: async (
		page: number = 1,
		limit: number = 10,
		search?: string
	): Promise<ProjectsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		if (search && search.trim()) {
			params.append("search", search.trim());
		}

		const response = await fetch(`/api/all-project?${params}`);
		if (!response.ok) {
			throw new Error("Failed to fetch projects");
		}
		return parse(await response.json());
	},
};
