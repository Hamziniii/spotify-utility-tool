import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import nodejs from "@astrojs/node";

import vercel from "@astrojs/vercel/serverless";

const isVercel = import.meta.env.DEPLOYMENT === "PRODUCTION"

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  adapter: isVercel ? 
    vercel() :
    nodejs({
      "mode": "standalone"
    }),
});
