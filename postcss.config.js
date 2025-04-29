export default {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
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
      grid: true,
    },
    "postcss-preset-env": {
      features: {
        "nesting-rules": false,
      },
      stage: 3,
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
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
