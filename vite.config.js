import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import emailHandler from "./api/email.js";

function localEmailApi() {
  return {
    name: "local-email-api",
    configureServer(server) {
      server.middlewares.use("/api/email", async (req, res, next) => {
        if (req.method !== "POST") return next();
        try {
          let raw = "";
          for await (const chunk of req) raw += chunk;
          req.body = raw ? JSON.parse(raw) : {};
          res.status = (code) => { res.statusCode = code; return res; };
          res.json = (body) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(body)); };
          await emailHandler(req, res);
        } catch {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Invalid request body." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Expose non-VITE variables to the Node-only local email handler, never to the browser.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    envPrefix: ['VITE_', 'FIREBASE_', 'CLOUDINARY_', 'APP_', 'PAYSTACK_'],
    plugins: [react(), tailwindcss(), localEmailApi()],
    server: { host: "0.0.0.0", port: 3000, strictPort: true, hmr: { port: 3000 } },
  };
});
