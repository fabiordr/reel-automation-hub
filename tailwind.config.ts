
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(240 3.7% 15.9%)',
				input: 'hsl(240 3.7% 15.9%)',
				ring: 'hsl(240 4.9% 83.9%)',
				background: 'hsl(240 10% 3.9%)',
				foreground: 'hsl(0 0% 98%)',
				primary: {
					DEFAULT: 'hsl(252 94% 67%)',
					foreground: 'hsl(0 0% 98%)'
				},
				secondary: {
					DEFAULT: 'hsl(240 3.7% 15.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				destructive: {
					DEFAULT: 'hsl(0 62.8% 30.6%)',
					foreground: 'hsl(0 0% 98%)'
				},
				muted: {
					DEFAULT: 'hsl(240 3.7% 15.9%)',
					foreground: 'hsl(240 5% 64.9%)'
				},
				accent: {
					DEFAULT: 'hsl(240 3.7% 15.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				popover: {
					DEFAULT: 'hsl(240 10% 3.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				card: {
					DEFAULT: 'hsl(240 10% 3.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				sidebar: {
					DEFAULT: 'hsl(240 10% 3.9%)',
					foreground: 'hsl(240 5% 84.9%)',
					primary: 'hsl(252 94% 67%)',
					'primary-foreground': 'hsl(0 0% 98%)',
					accent: 'hsl(240 3.7% 15.9%)',
					'accent-foreground': 'hsl(240 5% 84.9%)',
					border: 'hsl(240 3.7% 15.9%)',
					ring: 'hsl(217.2 91.2% 59.8%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
