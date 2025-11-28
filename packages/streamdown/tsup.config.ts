import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ['index.tsx'],
  format: ['iife'],
  minify: true,
  outDir: "dist",
  sourcemap: false,
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
    if (id === 'util') {
      return {
        inherits: function(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
          });
        },
        deprecate: function(fn, msg) { return fn; },
        format: function(f) { return f; },
        inspect: function(obj) { return JSON.stringify(obj); }
      };
    }
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
  },
  external: []
});
