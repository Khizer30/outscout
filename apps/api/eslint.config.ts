import path from "path";
import { nestJsConfig } from "@repo/eslint-config/nest-js";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
  ...nestJsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: "tsconfig.eslint.json",
        tsconfigRootDir: path.resolve(__dirname)
      }
    }
  }
];

export default config;
