/*
 * @Description:
 * @Autor: zhenghui
 * @Date: 2021-09-17 17:50:20
 */
import { defineConfig } from 'vite';
import path from 'path';

const resolve = (dir) => path.join(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  publicDir:false,
  build: {
    lib: {
      entry: resolve('src/chrome/background/index.js'),
      formats: ['es'],
      name: 'backgroundScript',
      fileName: () => 'background.js',
    },
    outDir: './dist/assets/js'
  },
});
