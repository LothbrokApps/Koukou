/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        koukou: {
          black: "#090909",
          dark: "#14110f",
          brown: "#351b12",
          cream: "#f7f1e8",
          creamLight: "#fbf9f6",
          gold: "#c99535",
          goldLight: "#e5b95c",
          goldMuted: "#d9b76a",
          gray: "#777777",
          border: "#e8e1d7",
          cardBg: "#fbf9f5",
          danger: "#bd3636",
          success: "#25d366"
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(20, 17, 15, 0.12)',
        'luxury-hover': '0 25px 50px -12px rgba(201, 149, 53, 0.25)',
      }
    },
  },
  plugins: [],
}
