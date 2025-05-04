import { create } from "zustand";

export type CreateProjectStore = {
	chainID: number | undefined;
	name: string;
	logo: string | undefined;
	images: string[];
	shortDescription: string;
	longDescription: string;
	socials: {
		twitter?: string;
		telegram?: string;
		discord?: string;
		website?: string;
		github?: string;
	};
	isComplete: boolean;
	targetAudience: string;

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
	setTargetAudience: (targetAudience: string) => void;
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
		targetAudience: "",

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
		setTargetAudience: (targetAudience: string) => {
			set({ targetAudience });
		},
	};
});
