import path from "path";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    // baseURL: "http://localhost:5000/api",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] }
    }
  ]
  // webServer: {
  //   command: "pnpm dev",
  //   url: "http://localhost:5000",
  //   reuseExistingServer: !process.env.CI
  // }
});
