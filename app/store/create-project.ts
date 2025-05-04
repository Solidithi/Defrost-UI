import { create } from "zustand";

export type CreateProjectStore = {
	chainID: number | undefined;
	name: string;
	logo: string | undefined; // Changed to base64 string
	images: string[]; // Changed to array of base64 strings
	shortDescription: string;
	longDescription: string;
	socials: {
		twitter?: string;
		telegram?: string;
		discord?: string;
		website?: string;
		github?: string;
	};
	isComplete: boolean; // Track if the store is fulfilled

	setChainID: (chainID: number) => void;
	setName: (name: string) => void;
	setLogo: (logo: string | undefined) => void; // Updated to accept string or undefined
	setImages: (images: string[]) => void; // Updated to accept string array
	setShortDescription: (shortDescription: string) => void;
	setLongDescription: (longDescription: string) => void;
	setSocials: (socials: {
		twitter?: string;
		telegram?: string;
		discord?: string;
		website?: string;
		github?: string;
	}) => void;
	setIsComplete: (isCompleted: boolean) => void; // Function to set isComplete to true
};

export const useCreateProjectStore = create<CreateProjectStore>((set, get) => {
	return {
		chainID: undefined,
		name: "",
		logo: undefined,
		images: [],
		shortDescription: "",
		longDescription: "",
		socials: {},
		isComplete: false,

		setChainID: (chainID: number) => set({ chainID }),
		setName: (name: string) => {
			set({ name });
		},
		setLogo: (logo: string | undefined) => {
			// Allow undefined to clear the logo, otherwise validate it's a string
			if (logo !== undefined && typeof logo !== "string") {
				console.error("Invalid logo format");
				return;
			}
			set({ logo });
		},
		setImages: (images: string[]) => {
			if (!images || !Array.isArray(images)) {
				console.error("Invalid images format");
				return;
			}
			set({ images });
		},
		setShortDescription: (shortDescription: string) =>
			set({ shortDescription }),
		setLongDescription: (longDescription: string) =>
			set({ longDescription }),
		setSocials: (socials) => set({ socials }),
		setIsComplete: (isCompleted: boolean) => {
			set({ isComplete: isCompleted });
		},
	};
});
