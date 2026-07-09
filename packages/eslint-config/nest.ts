import globals from "globals";
import tseslint from "typescript-eslint";
import type { Linter } from "eslint";
import { config as baseConfig } from "./base.js";

export const nestJsConfig: Linter.Config[] = [
  {
    ignores: ["dist/**", "node_modules/**", "drizzle/**"]
  },
  ...baseConfig,
  {
    languageOptions: {
      globals: { ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
      }
    }
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-extraneous-class": "off"
    }
  }
];
