const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ✅ SUPABASE
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://iqxjehtdaayzvxkhgjpv.supabase.co",
  "sb_publishable_8xjgueVFW8zZ-yRKYZKHJw__OVlWIQr"
);

const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0"; // 🔥 obligatoire pour Render
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(fallback);
      });
      return;
    }

    const extension = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    // ✅ GET interviews
    if (url.pathname === "/api/interviews" && req.method === "GET") {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("❌ GET ERROR:", error);
        return sendJson(res, 500, { error });
      }

      return sendJson(res, 200, { interviews: data });
    }

    // ✅ POST interview
    if (url.pathname === "/api/interviews" && req.method === "POST") {
      console.log("🔥 POST appelé");

      const payload = await readJson(req);
      console.log("📦 PAYLOAD:", payload);

      const interview = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        data: {
          label: payload.label || "Unnamed interview",
          respondents: payload.respondents || [],
          answers: payload.answers || {},
          notes: payload.notes || "",
          summary: payload.summary || null
        }
      };

      console.log("📤 ENVOI SUPABASE:", interview);

      const { error } = await supabase
        .from("interviews")
        .insert([interview]);

      if (error) {
        console.log("❌ SUPABASE ERROR:", error);
        return sendJson(res, 500, { error });
      }

      return sendJson(res, 200, { ok: true });
    }

    // fichiers statiques
    serveStatic(req, res);

  } catch (error) {
    console.log("💥 SERVER ERROR:", error);
    sendJson(res, 500, { ok: false, error: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});