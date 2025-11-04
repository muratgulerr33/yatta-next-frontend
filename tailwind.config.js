/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
