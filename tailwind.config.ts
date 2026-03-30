import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7F77DD',
          light: '#EEEDFE',
          dark: '#534AB7',
        },
        cream: '#F5F4EF',
      },
    },
  },
  plugins: [],
}

export default config
