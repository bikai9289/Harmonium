import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const normalizedNextVitals = nextVitals.map((config) => {
  const plugins = config.plugins ?? {};

  return {
    ...config,
    rules: {
      ...config.rules,
      ...(plugins["@next/next"]
        ? { "@next/next/no-assign-module-variable": "warn" }
        : {}),
      ...(plugins.react ? { "react/display-name": "warn" } : {}),
      ...(plugins["react-hooks"]
        ? {
            "react-hooks/error-boundaries": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/purity": "warn",
            "react-hooks/rules-of-hooks": "warn",
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/static-components": "warn",
          }
        : {}),
    },
  };
});

const normalizedNextTs = nextTs.map((config) => {
  return {
    ...config,
  };
});

const eslintConfig = defineConfig([
  ...normalizedNextVitals,
  ...normalizedNextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "prefer-const": "warn",
    },
  },
]);

export default eslintConfig;
