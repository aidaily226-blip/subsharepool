import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#7F77DD',
        'brand-light': '#F0EFFF',
        cream: '#F7F6F3',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
