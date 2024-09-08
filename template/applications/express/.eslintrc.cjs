/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['@repo/eslint-config/server.cjs'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
    },
}
