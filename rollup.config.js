import path from 'path';
import camelcase from 'lodash.camelcase';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';
import nodeBuiltIns from 'rollup-plugin-node-builtins';
import nodeGlobals from 'rollup-plugin-node-globals';
import pkg from './package.json';

const capitalize = s => `${s[0].toUpperCase()}${s.slice(1)}`;

const defaultGlobals = Object.keys(pkg.peerDependencies || {}).reduce(
  (deps, dep) =>
    Object.assign({}, deps, {
      [dep]: capitalize(camelcase(dep)),
    }),
  {},
);

const defaultExternal = Object.keys(pkg.peerDependencies || {});

const name = process.env.BUILD_NAME || capitalize(camelcase(pkg.name));
const minify = process.env.BUILD_MINIFY != null;
const isNode = process.env.BUILD_NODE != null;

const formats = ['es', 'cjs', 'umd'];

const getFilename = format =>
  [pkg.name, `.${format}`, minify ? '.min' : null, '.js']
    .filter(Boolean)
    .join('');

const getFilepath = filename => path.join('dist', filename);

export default formats.map(format => ({
  input: 'src/index.js',
  output: {
    file: getFilepath(getFilename(format)),
    format,
  },
  exports: format === 'es' ? 'named' : 'default',
  name,
  external: defaultExternal,
  globals: defaultGlobals,
  plugins: [
    isNode ? nodeBuiltIns() : null,
    isNode ? nodeGlobals() : null,
    nodeResolve({ preferBuiltins: isNode, jsnext: true, main: true }),
    commonjs({ include: 'node_modules/**' }),
    json(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        ['env', { modules: false, targets: { browsers: ['ie 10', 'ios 7'] } }],
        'react',
        'flow',
      ],
      plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
        'external-helpers',
      ],
    }),
    minify ? uglify() : null,
  ].filter(Boolean),
}));
