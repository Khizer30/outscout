import { globalIgnores } from "eslint/config";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";
import type { Linter } from "eslint";
import { config as baseConfig } from "./base.js";

export const nextJsConfig: Linter.Config[] = [
  ...baseConfig,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    ...(pluginReact.configs.flat.recommended ?? {}),
    languageOptions: {
      ...(pluginReact.configs.flat.recommended?.languageOptions ?? {}),
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    }
  },
  {
    plugins: {
      "@next/next": pluginNext
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules
    }
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off"
    }
  }
];
