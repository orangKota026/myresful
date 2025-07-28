const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'myresful',
        inlineDynamicImports: true,
    },
    external: Object.keys(pkg.dependencies || {}),
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            useTsconfigDeclarationDir: true,
        }),
    ],
};
