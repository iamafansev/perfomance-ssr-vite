module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'prettier',
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'max-len': ['error', { code: 120 }],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-dynamic-require': 'off',
    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
    resolveJsonModule: 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.spec.{ts,tsx}', '*.config.{js,ts}'],
      },
    ],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-props-no-spreading': 0,
    'react/button-has-type': 0,
    'react/require-default-props': 0,
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': ['warn'],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
};
