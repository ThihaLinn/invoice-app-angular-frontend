module.exports = {
  plugins: [
    require('flowbite/plugin')
  ],
  content: [
    "./src/**/*.{html,ts}", // Include all HTML and TypeScript files in the src directory
  ],
  theme: {
    extend: {}, // Add your custom Tailwind theme configurations here
  },
  plugins: [], // Add any Tailwind plugins you want to use
};
