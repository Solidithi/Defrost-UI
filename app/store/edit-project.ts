import { create } from "zustand";
import { CreateProjectStore, useCreateProjectStore } from "./create-project";
import { project } from "@prisma/client";

/**
 * Re-use CreateProjectStore type for EditProjectStore,
 * and change logo/images to base64 strings for direct loading from DB,
 * add some edit-specific methods
 */
export type EditProjectStore = Omit<
	CreateProjectStore,
	| "logo"
	| "images"
	| "isComplete"
	| "setLogo"
	| "setImages"
	| "setIsComplete"
	| "setChainID"
> & {
	projectID: string;
	logo: string | undefined;
	images: string[];
	isDirty: boolean;
	socials: {
		twitter?: string;
		telegram?: string;
		discord?: string;
		website?: string;
		github?: string;
	};

	setLogo: (logo: string | undefined) => void;
	setImages: (images: string[]) => void;
	markAsDirty: () => void;
	resetDirtyState: () => void;
	setSocials: (socials: {
		twitter?: string;
		telegram?: string;
		discord?: string;
		website?: string;
		github?: string;
	}) => void;

	setCurrentProjectData: (currentProject: project) => void;
	saveCurrentProjectData: () => Promise<void>; // Throws error if fail
};

export const useEditProjectStore = create<EditProjectStore>((set, get) => {
	return {
		projectID: "",
		chainID: undefined,
		name: "",
		logo: undefined,
		images: [],
		shortDescription: "",
		longDescription: "",
		targetAudience: "",
		isDirty: false,
		socials: {},

		setLogo: (logo: string | undefined) => {
			// Allow undefined to clear the logo, otherwise validate it's a string
			if (logo !== undefined && typeof logo !== "string") {
				console.error("Invalid logo format");
				return;
			}
			set({ logo, isDirty: true });
		},

		setImages: (images: string[]) => {
			if (!images || !Array.isArray(images)) {
				console.error("Invalid images format");
				return;
			}
			set({ images, isDirty: true });
		},

		// Override the original setters to mark as dirty
		setName: (name: string) => set({ name, isDirty: true }),
		setShortDescription: (shortDescription: string) =>
			set({ shortDescription, isDirty: true }),
		setLongDescription: (longDescription: string) =>
			set({ longDescription, isDirty: true }),
		setTargetAudience: (targetAudience: string) =>
			set({ targetAudience, isDirty: true }),
		setSocials: (socials) => set({ socials, isDirty: true }),

		// Specific to edit mode
		markAsDirty: () => set({ isDirty: true }),
		resetDirtyState: () => set({ isDirty: false }),
		setCurrentProjectData: (currentProject: project) => {
			set({
				projectID: currentProject.id,
				chainID: currentProject.chain_id,
				name: currentProject.name || "",
				logo: currentProject.logo || undefined,
				images: currentProject.images || [],
				shortDescription: currentProject.short_description || "",
				longDescription: currentProject.long_description || "",
				targetAudience: currentProject.target_audience || "",
				socials: {
					twitter: currentProject.twitter || "",
					telegram: currentProject.telegram || "",
					discord: currentProject.discord || "",
					website: currentProject.website || "",
					github: currentProject.github || "",
				},
				isDirty: false, // Reset dirty state when loading project data
			});
		},

		saveCurrentProjectData: async () => {
			const {
				projectID,
				name,
				logo,
				images,
				shortDescription,
				longDescription,
				socials,
				targetAudience,
			} = get();

			if (!projectID) {
				throw new Error("No project ID provided");
			}

			// Include all fields regardless of whether they're empty
			// This ensures we can clear fields if needed
			const updateData = {
				id: projectID,
				name,
				logo,
				images,
				short_description: shortDescription,
				long_description: longDescription,
				target_audience: targetAudience,
				twitter: socials?.twitter || "",
				telegram: socials?.telegram || "",
				discord: socials?.discord || "",
				website: socials?.website || "",
				github: socials?.github || "",
			};

			// Call API to save project
			try {
				const response = await fetch("/api/project", {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updateData),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						`Failed to save project: ${errorData.message || response.statusText}`
					);
				}

				const data = await response.json();

				// Reset dirty state after successful save
				set({ isDirty: false });

				return data;
			} catch (error) {
				console.error("Error saving project:", error);
				throw error;
			}
		},
	};
});
