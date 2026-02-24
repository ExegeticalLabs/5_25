import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dawn: {
          background: "#FAFAFA",
          surface: "#FFFFFF",
          citrus: "#E1FF00",
          teal: "#008080",
        },
      },
    },
  },
  plugins: [],
};

export default config;
