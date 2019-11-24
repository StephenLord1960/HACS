import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import gzipPlugin from 'rollup-plugin-gzip'

export default {
    input: ['src/main.ts'],
    output: {
        file: 'hacs_frontend/debug.js',
        format: 'es',
    },
    plugins: [
        gzipPlugin(),
        resolve(),
        typescript(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};