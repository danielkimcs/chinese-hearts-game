module.exports = {
  mode: 'jit',
  purge: [
    './client/src/**/*.{js,jsx,ts,tsx}',
    './client/public/index.html'
  ],
  darkMode: 'class', // 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
