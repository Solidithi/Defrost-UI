import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";

const {
	default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const addVariablesForColors = ({ addBase, theme }: any) => {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		":root": newVars,
	});
};

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{ts,tsx}",
	],
	darkMode: ["class"],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			fontFamily: {
				comfortaa: ["var(--font-comfortaa)", ...fontFamily.sans],
				orbitron: ["var(--font-orbitron)", ...fontFamily.sans],
				permanentMarker: ["var(--font-permanent-marker)", "cursive"],
			},
			keyframes: {
				shine: {
					"0%": {
						"background-position": "100%",
					},
					"100%": {
						"background-position": "-100%",
					},
				},
			},
			animation: {
				shine: "shine 5s linear infinite",
			},
			// borderRadius: {
			// 	lg: "var(--radius)",
			// 	md: "calc(var(--radius) - 2px)",
			// 	sm: "calc(var(--radius) - 4px)",
			// },
			// colors: {
			// 	background: "hsl(var(--background))",
			// 	foreground: "hsl(var(--foreground))",
			// 	card: {
			// 		DEFAULT: "hsl(var(--card))",
			// 		foreground: "hsl(var(--card-foreground))",
			// 	},
			// 	popover: {
			// 		DEFAULT: "hsl(var(--popover))",
			// 		foreground: "hsl(var(--popover-foreground))",
			// 	},
			// 	primary: {
			// 		DEFAULT: "hsl(var(--primary))",
			// 		foreground: "hsl(var(--primary-foreground))",
			// 	},
			// 	secondary: {
			// 		DEFAULT: "hsl(var(--secondary))",
			// 		foreground: "hsl(var(--secondary-foreground))",
			// 	},
			// 	muted: {
			// 		DEFAULT: "hsl(var(--muted))",
			// 		foreground: "hsl(var(--muted-foreground))",
			// 	},
			// 	accent: {
			// 		DEFAULT: "hsl(var(--accent))",
			// 		foreground: "hsl(var(--accent-foreground))",
			// 	},
			// 	destructive: {
			// 		DEFAULT: "hsl(var(--destructive))",
			// 		foreground: "hsl(var(--destructive-foreground))",
			// 	},
			// 	border: "hsl(var(--border))",
			// 	input: "hsl(var(--input))",
			// 	ring: "hsl(var(--ring))",
			// 	chart: {
			// 		"1": "hsl(var(--chart-1))",
			// 		"2": "hsl(var(--chart-2))",
			// 		"3": "hsl(var(--chart-3))",
			// 		"4": "hsl(var(--chart-4))",
			// 		"5": "hsl(var(--chart-5))",
			// 	},
			// },
		},
	},
	// plugins: [addVariablesForColors, require("tailwindcss-animate")],
	plugins: [addVariablesForColors],
};

export default config;
