module.exports = {
  env: { browser: true, node: true, commonjs: true },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  extends: ['airbnb', 'airbnb/hooks', 'prettier', 'prettier/react'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      alias: {
        map: [['@components', './src/components']],
        extensions: ['.js', '.ts', '.tsx', '.json'],
      },
      typescript: {
        project: './tsconfig.json',
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        trailingComma: 'es5',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
      },
    ],
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx'],
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/button-has-type': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.stories.ts', '**/*.stories.tsx'] },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
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
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/media-has-caption': 'off',
  },
  overrides: [
    // typescript
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: ['*.test.js'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {
        'react/prop-types': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'warn',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
      },
    },
  ],
};
