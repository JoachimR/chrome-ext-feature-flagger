import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import biomePlugin from 'vite-plugin-biome'
import manifest from './manifest.json'

export default {
	plugins: [
		biomePlugin({
			mode: 'check',
			files: './src/**/*.{js,ts,vue}',
			applyFixes: true,
		}),
		vue(),
		// @ts-ignore
		crx({ manifest: manifest }),
	],
	build: {
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, 'src/index.html'),
			},
		},
	},
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			port: 5173,
		},
	},
}
