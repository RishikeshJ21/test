module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
          browsers: [
            ">0.2%",
            "not dead",
            "ie >= 11",
            "safari >= 9",
            "firefox >= 52",
            "chrome >= 49",
            "edge >= 16",
            "opera >= 36",
            "ios >= 9",
            "android >= 5",
          ],
        },
        useBuiltIns: "usage",
        corejs: "3.41.0",
        bugfixes: true,
        loose: false,
        modules: false,
        exclude: ["transform-typeof-symbol"],
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    "babel-plugin-macros",
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: {
          version: 3,
          proposals: true,
        },
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
  ],
};
