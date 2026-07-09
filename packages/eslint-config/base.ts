import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import eslintPluginImport from "eslint-plugin-import";
import type { Linter } from "eslint";

export const config: Linter.Config[] = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn"
    }
  },
  {
    plugins: {
      import: eslintPluginImport
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "prefer-const": "warn",
      "no-trailing-spaces": "warn",
      "no-var": "warn",
      "import/no-duplicates": "warn",
      "import/no-unresolved": "off",
      "import/newline-after-import": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: false }
        }
      ],
      eqeqeq: ["warn", "always"],
      curly: "warn"
    }
  },
  {
    ignores: ["node_modules/**", ".turbo/**", "**/*.d.ts"]
  }
];
