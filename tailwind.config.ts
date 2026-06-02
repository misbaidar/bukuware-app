import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bwLight: '#fff3e1',   
        bwDark: '#96582e',    
        bwText: '#233766',    
        bwAccent: '#ffb703',  
      },
      fontFamily: {
        // Menghubungkan font Arimo dari Next.js ke Tailwind
        sans: ['var(--font-arimo)', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px #233766',
        'brutal-sm': '4px 4px 0px 0px #233766',
        'brutal-hover': '2px 2px 0px 0px #233766',
      }
    },
  },
  plugins: [],
};
export default config;