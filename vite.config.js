/*
 * @Description: 
 * @Autor: zhenghui
 * @Date: 2021-09-14 20:43:39
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const resolve = (dir) => path.join(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  base: './',
  plugins: [vue()],
  server: {
    proxy: {
      '/zhenghui': {
        target: 'http://192.168.17.206/zhenghui',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zhenghui/, ''),
      },
    },
  },
});
