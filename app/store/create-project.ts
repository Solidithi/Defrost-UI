import { create } from "zustand";

type CreateProjectStore = {
	chainID: number | undefined;
	name: string;
	logo: File | undefined;
	images: File[];
	shortDescription: string;
	longDescription: string;
	isComplete: boolean; // Track if the store is fulfilled

	setChainID: (chainID: number) => void;
	setName: (name: string) => void;
	setLogo: (logo: File) => void;
	setImages: (images: File[]) => void;
	setShortDescription: (shortDescription: string) => void;
	setLongDescription: (longDescription: string) => void;
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
		setIsComplete: (isCompleted: boolean) => {
			set({ isComplete: isCompleted });
		},
	};
});
