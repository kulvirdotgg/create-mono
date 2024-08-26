/** @type {import("eslint").Linter.Config} */
export default {
    extends: ['@repo/eslint-config/server.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
    },
}
