export default {
  "src/**/*.{ts,tsx}": [
    "eslint --quiet",
    "prettier --write",
    "vitest related --run",
  ],
  "src/**/*": () => "tsc",
};
