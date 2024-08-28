import { resolve } from "node:path"

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use server side
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

export default {
    extends: [
        "@vercel/style-guide/eslint/node",
        "@vercel/style-guide/eslint/typescript",
    ].map(resolve),
    parserOptions: {
        project,
    },
    env: {
        node: true,
        es6: true,
    },
    plugins: ["only-warn"],
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    overrides: [],
    ignorePatterns: [".*.js", "node_modules/", "dist/"],
    // add rules configurations here
    rules: {
        "import/no-default-export": "off",
    },
};
