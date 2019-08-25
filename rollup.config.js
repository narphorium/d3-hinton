import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';

let pluginOptions = [
  resolve({
    browser: true
  }),
  eslint(),
  babel({
    presets: [
      [
        "@babel/preset-env", {
          "targets": {
            "browsers": ["last 2 versions", "safari >= 7"]
          },
          "forceAllTransforms": true
        }
      ]
    ],
    babelrc: false,
    exclude: 'node_modules/**'
  })
];

const d3External = [
  'd3-color',
  'd3-selection'
]

const globals = {}
d3External.forEach(k => {
  globals[k] = 'd3'
})

export default {
  input: 'index.js',
  output: {
    name: 'd3',
    format: 'umd',
    file: 'build/d3-hinton.js',
    extend: true,
    globals: globals,
  },
  external: d3External,
  plugins: pluginOptions
}
