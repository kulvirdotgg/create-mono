import base from "../../prettier.config.mjs"

/**
@see https://prettier.io/docs/en/configuration#sharing-configurations 
@type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    ...base,
    plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
