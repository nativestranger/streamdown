import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  entry: ['index.tsx'],
  format: ['cjs', 'esm', 'iife'],
  minify: true,
  outDir: 'dist',
  sourcemap: false,
  external: ['react', 'react-dom'],
  globalName: 'Streamdown',
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': '"production"',
    'global': 'globalThis'
  },
  banner: {
    js: `
if (typeof process === "undefined") { 
  var process = { env: { NODE_ENV: "production" } }; 
}
if (typeof require === "undefined") {
  var require = function(id) { 
    throw new Error("Module '" + id + "' not found in browser build"); 
  };
}
    `.trim()
  },
  footer: {
    js: 'if (typeof window !== "undefined") { window.Streamdown = Streamdown.default || Streamdown; }'
  },
  esbuildOptions(options) {
    options.platform = 'browser';
    options.define = {
      ...options.define,
      '__dirname': '""',
      '__filename': '""'
    };
  }
});
