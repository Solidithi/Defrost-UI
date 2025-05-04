/**
 * Resizes an image file to specified dimensions while maintaining aspect ratio
 * @param file The image file to resize
 * @param maxWidth Maximum width in pixels
 * @param maxHeight Maximum height in pixels
 * @param quality Image quality (0-1)
 * @returns A promise that resolves to a Blob of the resized image
 */
export const resizeImage = async (
	file: File,
	maxWidth = 1200,
	maxHeight = 800,
	quality = 0.8
): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		// Create an image object
		const img = new Image();
		img.src = URL.createObjectURL(file);

		img.onload = () => {
			// Calculate new dimensions
			let width = img.width;
			let height = img.height;

			// Maintain aspect ratio while resizing
			if (width > maxWidth) {
				height = Math.floor(height * (maxWidth / width));
				width = maxWidth;
			}

			if (height > maxHeight) {
				width = Math.floor(width * (maxHeight / height));
				height = maxHeight;
			}

			// Create a canvas to draw the resized image
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			// Draw the resized image
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Could not get 2D context"));
				return;
			}

			ctx.drawImage(img, 0, 0, width, height);

			// Convert to blob
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error("Failed to create blob"));
					}

					// Clean up
					URL.revokeObjectURL(img.src);
				},
				file.type,
				quality
			);
		};

		img.onerror = () => {
			reject(new Error("Failed to load image"));
			URL.revokeObjectURL(img.src);
		};
	});
};

/**
 * Resizes an image file and converts it to base64
 * @param file The image file to resize and convert
 * @param isLogo Whether the image is a logo (uses different dimensions)
 * @returns A promise that resolves to a base64 string
 */
export const resizeAndConvertToBase64 = async (
	file: File,
	isLogo = false
): Promise<string> => {
	try {
		// Different dimensions for logos vs regular images
		const maxWidth = isLogo ? 512 : 1200;
		const maxHeight = isLogo ? 512 : 800;

		// Resize the image
		const resizedBlob = await resizeImage(file, maxWidth, maxHeight);

		// Convert to base64
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(resizedBlob);
		});
	} catch (error) {
		console.error("Error resizing image:", error);
		// Fallback to regular base64 conversion if resizing fails
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
};
