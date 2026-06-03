import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CRA-equivalent setup: dev server on :3000, production output to build/
// so `npm run deploy` (aws s3 sync build/ ...) stays untouched.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
});
