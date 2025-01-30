module.exports = {
  // Make sure ESLint considers this the root of your project
  root: true,

  // Set the environment for browser and Node.js
  env: {
    browser: true,
    node: true,
    es2021: true,
  },

  // Use Babel ESLint parser
  parser: '@babel/eslint-parser',
  parserOptions: {
    // Not always necessary, but can be helpful
    requireConfigFile: false,
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },

  // Automatically detect the React version
  settings: {
    react: {
      version: 'detect',
    },
  },

  // Extend from recommended configs
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',     // Recommended rules for React
    'plugin:react-hooks/recommended', // Recommended rules for React hooks
    'plugin:jsx-a11y/recommended',  // Accessibility rules for JSX
    'plugin:import/recommended',    // Recommended rules for import/export syntax
  ],

  // Add extra ESLint plugins
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],

  // Custom rules (override or add to the above configs)
  rules: {
    // For example:
    'react/prop-types': 'off',  // Disable prop-types as an example
    'import/no-unresolved': 'off',
    'jsx-a11y/anchor-is-valid': 'off', // Next.js often uses <a> without href
    'react/react-in-jsx-scope': 'off', // Not needed for React 17+
  },
};
