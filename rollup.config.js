// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import sass from 'rollup-plugin-sass'
import svg from 'rollup-plugin-svg'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import commonjs from 'rollup-plugin-commonjs'
import fs from 'fs'

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
    name: 'login'
  },
  plugins: [
    peerDepsExternal({
      includeDependencies: false
    }),
    sass({
      output: (styles, styleNodes) => {
        fs.writeFileSync('dist/style.css', styles)
      }
    }),
    svg(),
    resolve({
      browser: true
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        [
          'module-resolver',
          {
            'root': [
              '.'
            ],
            'alias': {
              'PasswordField': './src/components/PasswordField',
              'SignInEmailTextField': './src/components/SignInEmailTextField'
            }
          }
        ]
      ]
    }),
    commonjs({
      exclude: ['node_modules/*']
    })
  ]
}
