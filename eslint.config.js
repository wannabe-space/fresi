import antfu from '@antfu/eslint-config'
// import pluginCompiler from 'eslint-plugin-react-compiler'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    rules: {
      'ts/no-explicit-any': 'error',
      'node/prefer-global/process': 'off',
    },
    ignores: ['drizzle/migrations/meta/*.json'],
  },
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        whitelist: ['toaster'],
      },
    },
  },
  // {
  //   name: 'react-compiler/recommended',
  //   plugins: {
  //     'react-compiler': pluginCompiler,
  //   },
  //   rules: {
  //     'react-compiler/react-compiler': 'error',
  //   },
  // },
)
