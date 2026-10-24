import eslint from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/*.d.ts'],
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...eslintPluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // TypeScript reports undefined names with better type information.
      'no-undef': 'off',
      // Project components already use concise names such as Calendar and Hero.
      'vue/multi-word-component-names': 'off',
    },
  },
);
