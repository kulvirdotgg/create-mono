/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['@repo/eslint-config/vite.cjs'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
    },
}
