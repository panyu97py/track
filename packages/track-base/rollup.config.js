import path from 'path'
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';

const {join} = require('path')
const cwd = __dirname

export default {
    input: join(cwd, 'src/index.ts'),
    output: {
        file: path.resolve(cwd, 'dist/index.js'),
        format: 'esm',
    },
    plugins: [
        typescript({useTsconfigDeclarationDir: true}),
        resolve(),
        commonjs(),
        buble()
    ],
    external: ['uuid', 'inversify', 'reflect-metadata'],
}
