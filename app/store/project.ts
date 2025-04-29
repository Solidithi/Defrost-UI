import { create } from "zustand";
import { persist } from "zustand/middleware";
import { project } from "@prisma/client";
import { useAccount } from "wagmi";

interface ProjectState {
	// Project data
	currentProject: project | null;
	lastFetchedTime: number | null;

	// Global project loading state
	isLoading: boolean;
	error: string | null;

	// Page-specific UI states
	pageStates: {
		overview: { isLoading: boolean; error: string | null };
		edit: { isLoading: boolean; error: string | null; isDirty: boolean };
		launchpool: { isLoading: boolean; error: string | null };
		analytics: { isLoading: boolean; error: string | null };
	};

	// Actions
	fetchProject: (projectID: string, forceRefresh?: boolean) => Promise<void>;
	fetchMockProject: (
		chainID: number,
		projectID: string,
		userAddress: string
	) => Promise<void>;
	clearProject: () => void;

	// Page state actions
	setPageLoading: (
		page: keyof ProjectState["pageStates"],
		isLoading: boolean
	) => void;
	setPageError: (
		page: keyof ProjectState["pageStates"],
		error: string | null
	) => void;

	// Page-specific actions
	setEditDirty: (isDirty: boolean) => void;
	// Add more page-specific actions as needed
}

export const useProjectStore = create<ProjectState>()(
	persist(
		(set, get) => ({
			currentProject: null,
			lastFetchedTime: null,
			isLoading: false,
			error: null,

			// Initialize page-specific states
			pageStates: {
				overview: { isLoading: false, error: null },
				edit: { isLoading: false, error: null, isDirty: false },
				launchpool: { isLoading: false, error: null },
				analytics: { isLoading: false, error: null },
			},

			fetchProject: async (projectId, forceRefresh = false) => {
				const state = get();
				const now = Date.now();
				const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5 minutes in miliseconds

				// Skip fetching if project is already loaded, still fresh, and force refresh is not requested
				if (
					!forceRefresh &&
					state.currentProject?.id === projectId &&
					state.lastFetchedTime &&
					now - state.lastFetchedTime < MAX_CACHE_AGE_MS
				) {
					return;
				}

				set({ isLoading: true, error: null });

				try {
					const response = await fetch(`/api/projects/${projectId}`);

					if (!response.ok) {
						throw new Error(
							`Failed to fetch project: ${response.statusText}`
						);
					}

					const data = await response.json();

					set({
						currentProject: data,
						lastFetchedTime: now,
						isLoading: false,
					});
				} catch (error) {
					console.error("Error fetching project:", error);
					set({
						error:
							error instanceof Error
								? error.message
								: "Unknown error fetching project",
						isLoading: false,
					});
				}
			},

			fetchMockProject: async (chainID, projectID, userAddress) => {
				set({ isLoading: true, error: null });

				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				const mockProject = {
					id: projectID,
					name: "YapMaster Protocol",
					token_address: "0x96b6D28DF53641A47be72F44BE8C626bf07365A8",
					token_symbol: "PRO",
					token_decimals: 18,
					owner_id: userAddress, // Will be replaced with actual connected address
					chain_id: chainID,
					images: [],
					logo: "",
					short_description:
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry",
					long_description:
						"Contrary to popular belief, Lorem Ipsum is not simply random text...",
					created_at: new Date(Date.now() - 864000000),
					tx_hash: "0x00",
				} as project;

				set({
					currentProject: mockProject,
					lastFetchedTime: Date.now(),
					isLoading: false,
				});
				return;
			},

			clearProject: () => {
				set({
					currentProject: null,
					lastFetchedTime: null,
					error: null,
				});
			},

			// Page state actions
			setPageLoading: (page, isLoading) => {
				set((state) => ({
					pageStates: {
						...state.pageStates,
						[page]: {
							...state.pageStates[page],
							isLoading,
						},
					},
				}));
			},

			setPageError: (page, error) => {
				set((state) => ({
					pageStates: {
						...state.pageStates,
						[page]: {
							...state.pageStates[page],
							error,
						},
					},
				}));
			},

			// Page-specific actions
			setEditDirty: (isDirty) => {
				set((state) => ({
					pageStates: {
						...state.pageStates,
						edit: {
							...state.pageStates.edit,
							isDirty,
						},
					},
				}));
			},
		}),
		{
			name: "project-storage",
			partialize: (state) => ({
				currentProject: state.currentProject,
				lastFetchedTime: state.lastFetchedTime,
				// Don't persist page-specific UI states
			}),
		}
	)
);
