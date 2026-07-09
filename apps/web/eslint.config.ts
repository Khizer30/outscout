import { nextJsConfig } from "@repo/eslint-config/next-js";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
  ...nextJsConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
];

export default config;
