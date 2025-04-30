import { create } from "zustand";

type CreateProjectStore = {
	chainID: number | undefined;
	name: string;
	logo: File | undefined;
	images: File[];
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
	setLogo: (logo: File) => void;
	setImages: (images: File[]) => void;
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
		setLogo: (logo: File) => set({ logo }),
		setImages: (images: File[]) => set({ images }),
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
