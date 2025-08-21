import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'index.umd.tsx',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'Streamdown',
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    inlineDynamicImports: true
  },
  external: ['react', 'react-dom'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
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
