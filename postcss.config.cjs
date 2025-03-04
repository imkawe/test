module.exports = {
  plugins: {
    "@tailwindcss/postcss": {
      tailwindConfig: "./tailwind.config.cjs" // Ruta correcta
    },
    autoprefixer: {}
  }
};