import { create } from "zustand";

type ProjectStore = {
	logo: string;
	images: string[];
	shortDescription: string;
	longDescription: string;

	setLogo: (logo: string) => void;
	setImages: (images: string[]) => void;
	setShortDescription: (shortDescription: string) => void;
	setLongDescription: (longDescription: string) => void;
};

export const useProjectStore = create<ProjectStore>((set, get) => {
	return {
		logo: "",
		images: [],
		shortDescription: "",
		longDescription: "",

		setLogo: (logo: string) => set({ logo }),
		setImages: (images: string[]) => set({ images }),
		setShortDescription: (shortDescription: string) =>
			set({ shortDescription }),
		setLongDescription: (longDescription: string) =>
			set({ longDescription }),
	};
});
