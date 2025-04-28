module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
          browsers: [">0.25%", "not ie 11", "not op_mini all"]
        },
        useBuiltIns: "usage",
        corejs: "3.41.0",
        bugfixes: true,
        loose: false,
        modules: false,
        exclude: ["transform-typeof-symbol"]
      }
    ],
    ["@babel/preset-react", {
      runtime: "automatic"
    }],
    "@babel/preset-typescript"
  ],
  plugins: [
    "babel-plugin-macros",
    ["@babel/plugin-transform-runtime", {
      corejs: {
        version: 3,
        proposals: true
      },
      helpers: true,
      regenerator: true,
      useESModules: true
    }]
  ]
} 