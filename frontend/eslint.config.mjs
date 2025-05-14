import { FlatCompat } from '@eslint/eslintrc';
import pluginPrettier from 'eslint-plugin-prettier'; // the ever-watchful formatting enforcer
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Classic configs via compat
  ...compat.extends(
    'prettier', // disables rules that conflict with Prettier
    'next/core-web-vitals', // your Next.js compliance badge
    'next/typescript', // gives TypeScript a stern talking-to
  ),

  // Plugin and custom rules
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      indent: 'off', // we use Prettier for indentation
      'prettier/prettier': 'error', // yells at you in red if Prettier isn’t followed
    },
  },
];

export default eslintConfig;
