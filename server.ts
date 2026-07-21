import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function openBrowser(url: string) {
  const command = process.platform === "win32"
    ? "cmd"
    : process.platform === "darwin"
      ? "open"
      : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];

  const browserProcess = spawn(command, args, {
    detached: true,
    stdio: "ignore",
  });

  browserProcess.on("error", (error) => {
    console.warn(`Could not open the browser automatically: ${error.message}`);
  });
  browserProcess.unref();
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const HOST = "127.0.0.1";

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}`;
    console.log(`Server is running on ${url}`);

    if (process.env.NODE_ENV !== "production" && process.env.OPEN_BROWSER !== "false") {
      openBrowser(url);
    }
  });
}

startServer();
