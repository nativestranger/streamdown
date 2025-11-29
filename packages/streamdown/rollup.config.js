import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const baseConfig = {
  input: 'index.tsx',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto'
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false
    }),
    postcss({
      extract: false,
      inject: true
    })
  ]
};

export default [
  // Regular UMD build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'Streamdown',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime'
      },
      inlineDynamicImports: true,
      exports: 'named',
      footer: `
if (typeof window !== 'undefined' && window.Streamdown) {
  // Make Streamdown.Streamdown the default while keeping named exports
  var StreamdownModule = window.Streamdown;
  window.Streamdown = StreamdownModule.Streamdown;
  Object.assign(window.Streamdown, StreamdownModule);
}
      `.trim()
    }
  },
  // Minified UMD build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'Streamdown',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime'
      },
      inlineDynamicImports: true,
      exports: 'named',
      footer: `
if (typeof window !== 'undefined' && window.Streamdown) {
  var StreamdownModule = window.Streamdown;
  window.Streamdown = StreamdownModule.Streamdown;
  Object.assign(window.Streamdown, StreamdownModule);
}
      `.trim()
    },
    plugins: [
      ...baseConfig.plugins,
      terser()
    ]
  }
];
