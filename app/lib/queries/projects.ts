import "@/app/lib/superjson-init";
import { EnrichedProject } from "@/app/types";
import { parse } from "superjson";
import { Address } from "viem";

export interface ProjectsResponse {
	projects: EnrichedProject[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ProjectFilters {
	chainId?: number | string;
	category?: string;
	search?: string;
}

export const projectsApi = {
	// Fetch all projects with pagination (for infinite scroll - card view)
	getAllProjects: async (
		page: number = 1,
		limit: number = 10,
		filters: ProjectFilters = {}
	): Promise<ProjectsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		Object.entries(filters).forEach(([key, value]) => {
			if (!value) {
				return;
			}
			params.append(key, value.toString().trim());
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
		filters: ProjectFilters = {}
	): Promise<ProjectsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		Object.entries(filters).forEach(([key, value]) => {
			if (!value) {
				return;
			}
			params.append(key, value.toString().trim());
		});

		const response = await fetch(`/api/all-project?${params}`);
		if (!response.ok) {
			throw new Error("Failed to fetch projects");
		}
		return parse(await response.json());
	},

	getMyProjects: async (
		projectOwnerAddress: Address,
		page: number = 1,
		limit: number = 10,
		filters: ProjectFilters = {}
	): Promise<ProjectsResponse> => {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			projectOwnerAddress: projectOwnerAddress.toString(),
		});

		Object.entries(filters).forEach(([key, value]) => {
			if (!value) {
				return;
			}
			params.append(key, value.toString().trim());
		});

		const response = await fetch(`/api/my-projects?${params}`);
		if (!response.ok) {
			throw new Error("Failed to fetch projects");
		}
		return parse(await response.json());
	},
};
