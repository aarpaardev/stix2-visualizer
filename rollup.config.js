import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import packageJson from "./package.json" assert { type: "json" };
import url from '@rollup/plugin-url';
import replace from '@rollup/plugin-replace';

import pkg from './package.json' with { type: 'json' };
const { name, homepage, version, dependencies, peerDependencies } = pkg;

const umdConf = {
  format: 'umd',
  name: 'AaarPaarDevStixVisualizer',
  globals: {
    react: 'React', 'react-dom': 'ReactDOM', 'react/jsx-runtime': 'jsxRuntime'
  },
  assetFileNames: 'assets/[name]-[hash][extname]', // store assets in 'dist/assets'
  banner: `// Version ${version} ${name} - ${homepage}`
};


const imageUrlPlugin = 
url({
  limit: Infinity,
});

export default [
  {
    external: ['react', 'react-dom'],
    input: 'src/index.ts',
    output: [
      {
        ...umdConf,
        file: packageJson.main,   // → "dist/index.js",
        sourcemap: true
      },
      { // minify
        ...umdConf,
        file: `dist/index.min.js`,
        plugins: [terser({
          output: { comments: '/Version/' }
        }),
      
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),]
      }
    ],
    plugins: [
      imageUrlPlugin,
      peerDepsExternal(),
      resolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json", exclude: ['**/*.stories.tsx', '**/*.stories.ts', '**/.examples/**'] }),
    ]
  },
  { // ES module
    input: 'src/index.ts',
    output: [
      {
        format: 'esm',
        file: packageJson.module,
        assetFileNames: 'assets/[name]-[hash][extname]', 
      }
    ],
    external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
    plugins: [
      imageUrlPlugin,
      peerDepsExternal(),
      resolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json", exclude: ['**/*.stories.tsx', '**/*.stories.ts', '**/.examples/**'], }),
    ]
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types, format: 'es' }],
    plugins: [dts.default()],
  },
];