// /** @type {import("eslint").Linter.Config} */
// module.exports = {
//     root: true,
//     extends: ['@repo/eslint-config/next.cjs'],
//     parser: '@typescript-eslint/parser',
//     parserOptions: {
//         project: true,
//     },
//     rules: {
//         '@typescript-eslint/explicit-function-return-type': 'off',
//     },
// }

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
