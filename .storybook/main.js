module.exports = {
  "stories": [
    "./stories/**/*.stories.mdx",
    "./stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    { name: "@storybook/addon-links" },
    {
      name: "@storybook/addon-essentials",
      options: {
        backgrounds: false
      }
    }
  ],
  "core": {
    "builder": "webpack5"
  },
  "staticDirs": ['../src'],
  "env": (config) => ({
    ...config,
    ORIGIN_URL: 'https://passbolt.github.io/passbolt_styleguide',
  }),
}
