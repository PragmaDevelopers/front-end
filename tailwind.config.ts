import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['var(--font-inter)', 'sans-serif'],
                poppins: ['var(--font-poppins)', 'sans-serif'],
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('tailwind-scrollbar'),
        require('@headlessui/tailwindcss'),
    ],
}
export default config
