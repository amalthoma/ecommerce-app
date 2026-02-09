/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101014',
        sand: '#f6f3ea',
        accent: '#ff6b35',
        olive: '#7c8455'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Public Sans"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
