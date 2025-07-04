import { EnrichedProject } from "@/app/types";

export interface ProjectsResponse {
	projects: EnrichedProject[];
	total: number;
	page: number;
	limit: number;
}

export const projectsApi = {
	// Fetch all projects with pagination
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
		return response.json();
	},
};
