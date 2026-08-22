import path from "path";
import { config } from "dotenv";
import type { NextConfig } from "next";

// Load TurboRepo Environment Variables
config({ path: path.resolve(__dirname, "../../.env") });

const nextConfig: NextConfig = {};

export default nextConfig;
