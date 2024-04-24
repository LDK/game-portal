import type { Config } from "tailwindcss";

// Define our own type for the plugin function based on typical usage patterns
interface TailwindPluginHelper {
  addUtilities: (utilities: any, options?: any) => void;
  theme: (key: string) => any;
}

const config: Config = {
  content: {
    files: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ]},
  safelist: [
    'bg-green', 'bg-red', 'bg-blue', 'bg-yellow', 'bg-black', // Uno colors
    { pattern: /^(p|m)(x|y|t|b|l|r)?-/ }, // padding and margin classes with optional x, y, t, b, l, r 
    { pattern: /^(position|top|bottom|left|right)/ }, // position classes
  ],
  theme: {
    extend: {
      colors: {
        'green': {
          DEFAULT: '#4A752C',
          50: '#A6D287',
          100: '#9BCC78',
          200: '#85C15A',
          300: '#70B042',
          400: '#5D9337',
          500: '#4A752C',
          600: '#304C1D',
          700: '#16230D',
          800: '#000000',
          900: '#000000',
          950: '#000000'
        }, // same green as used in .felt-effect
        'gold': {
          DEFAULT: '#DAA520',
          50: '#F5E5BC',
          100: '#F3DEAB',
          200: '#EDD087',
          300: '#E8C263',
          400: '#E3B440',
          500: '#DAA520',
          600: '#A98019',
          700: '#785B12',
          800: '#47360A',
          900: '#161103',
          950: '#000000'
        },
        'blue': {
          DEFAULT: '#003366',
          50: '#1F8FFF',
          100: '#0A85FF',
          200: '#0070E0',
          300: '#005CB8',
          400: '#00478F',
          500: '#003366',
          600: '#00172E',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000'
        },
        'red': {
          DEFAULT: '#B22222',
          50: '#ED9F9F',
          100: '#E98E8E',
          200: '#E36C6C',
          300: '#DC4949',
          400: '#D42929',
          500: '#B22222',
          600: '#831919',
          700: '#541010',
          800: '#250707',
          900: '#000000',
          950: '#000000'
        }
      },
      textShadow: {
        xs: '1px 1px 2px rgba(0, 0, 0, 0.4)',
        sm: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        md: '4px 4px 6px rgba(0, 0, 0, 0.6)',
        lg: '5px 5px 7px rgba(0, 0, 0, 0.7)',
        xl: '6px 6px 8px rgba(0, 0, 0, 0.8)',
      },
      fontFamily: {
        'sans': ['Raleway', 'Roboto', 'Rubik', 'sans-serif'], // Default sans-serif
        'serif': ['Della Respira', 'serif'], // Default serif
        'mono': ['Fira Code', 'monospace'] // Default monospace
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }: TailwindPluginHelper) {
      const newUtilities: { [key: string]: { textShadow: string } } = {};
      const textShadows = theme('textShadow') as { [key: string]: string };

      Object.keys(textShadows).forEach(key => {
        newUtilities[`.text-shadow-${key}`] = {
          textShadow: textShadows[key]
        };
      });

      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
};

export default config;
