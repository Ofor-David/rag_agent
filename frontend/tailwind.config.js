/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f7f3ee',
          dark: '#ede7dc',
        },
        ink: {
          DEFAULT: '#1c1a17',
          soft: '#4a4640',
          muted: '#8a8278',
        },
        gold: {
          DEFAULT: '#b8860b',
          light: '#f5edd6',
          border: '#d4a843',
        },
        green: {
          DEFAULT: '#2d6a4f',
          light: '#d8f0e6',
        },
        red: {
          light: '#fde8e8',
          DEFAULT: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(28, 26, 23, 0.08)',
        'card-lg': '0 8px 32px rgba(28, 26, 23, 0.12)',
      },
      borderRadius: {
        'card': '10px',
        'card-lg': '16px',
      },
    },
  },
  plugins: [],
}
