/** @type {import('postcss').ProcessorOptions} */
module.exports = {
  plugins: {
    tailwindcss: require('tailwindcss'),
    autoprefixer: require('autoprefixer'),
  },
};