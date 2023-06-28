import { PluginOption, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
// import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: ['**/*.tsx'],
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
    // visualizer({
    //   template: 'treemap', // or sunburst
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   filename: 'analyse.html', // will be saved in project's root
    // }) as PluginOption,
  ],
})
