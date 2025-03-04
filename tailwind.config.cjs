module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("tailwindcss")], // Necesario para Tailwind v4
};