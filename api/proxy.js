"use strict";

const http = require("node:http");
const https = require("node:https");
const {Transform} = require("node:stream");

const MAX_REQUEST_BYTES = 4_500_000;
const PROXY_PATH_PARAMETER = "__crop_doctor_path";
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function sendError(response, status, message) {
  if (response.headersSent || response.destroyed) {
    response.destroy();
    return;
  }
  const body = JSON.stringify({error: message});
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
  });
  response.end(body);
}

function getBackendUrl() {
  const configured = process.env.RENDER_BACKEND_URL;
  if (!configured) throw new Error("RENDER_BACKEND_URL is not configured.");
  const backend = new URL(configured);
  const localHttp = backend.protocol === "http:" && ["localhost", "127.0.0.1"].includes(backend.hostname);
  if (backend.protocol !== "https:" && !localHttp) {
    throw new Error("RENDER_BACKEND_URL must use HTTPS.");
  }
  if (backend.username || backend.password || backend.search || backend.hash) {
    throw new Error("RENDER_BACKEND_URL must be an origin or base path without credentials, query, or fragment.");
  }
  return backend;
}

function buildTarget(req, backend) {
  const incoming = new URL(req.url || "/", "http://vercel.local");
  const originalPath = incoming.searchParams.get(PROXY_PATH_PARAMETER);
  if (!originalPath || !originalPath.startsWith("/") || originalPath.startsWith("//")) {
    throw new Error("The proxy route did not provide a valid original path.");
  }
  incoming.searchParams.delete(PROXY_PATH_PARAMETER);

  const basePath = backend.pathname.replace(/\/+$/, "");
  const target = new URL(`${basePath}${originalPath}`, backend.origin);
  target.search = incoming.search;
  return target;
}

function copyRequestHeaders(request, target) {
  const headers = {...request.headers};
  for (const header of Object.keys(headers)) {
    if (HOP_BY_HOP_HEADERS.has(header.toLowerCase()) || header.toLowerCase().startsWith("x-vercel-")) {
      delete headers[header];
    }
  }
  delete headers.host;
  headers.host = target.host;
  headers["x-forwarded-host"] = request.headers.host || "";
  headers["x-forwarded-proto"] = "https";
  return headers;
}

function copyResponseHeaders(response) {
  const headers = {};
  for (const [name, value] of Object.entries(response.headers)) {
    if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase())) headers[name] = value;
  }
  return headers;
}

module.exports = function proxy(request, response) {
  let backend;
  let target;
  try {
    backend = getBackendUrl();
    target = buildTarget(request, backend);
  } catch (error) {
    console.error("Vercel-to-Render proxy configuration error:", error.message);
    sendError(response, 503, "The Render backend is not configured for this deployment.");
    return;
  }

  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    sendError(response, 413, "Request is too large. Maximum request size is 4.5 MB.");
    return;
  }

  const transport = target.protocol === "https:" ? https : http;
  const upstream = transport.request(target, {
    method: request.method,
    headers: copyRequestHeaders(request, target),
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode || 502, copyResponseHeaders(upstreamResponse));
    upstreamResponse.pipe(response);
  });

  let rejectedOversize = false;
  upstream.on("error", (error) => {
    if (rejectedOversize) return;
    console.error("Could not reach the configured Render backend:", error.message);
    sendError(response, 502, "The Render backend could not be reached. Please retry shortly.");
  });
  request.on("aborted", () => upstream.destroy());

  let receivedBytes = 0;
  const sizeLimit = new Transform({
    transform(chunk, encoding, callback) {
      receivedBytes += chunk.length;
      if (receivedBytes > MAX_REQUEST_BYTES) {
        const error = new Error("Request exceeded the 4.5 MB proxy limit.");
        error.code = "REQUEST_TOO_LARGE";
        callback(error);
        return;
      }
      callback(null, chunk);
    },
  });
  sizeLimit.on("error", (error) => {
    if (error.code === "REQUEST_TOO_LARGE") {
      rejectedOversize = true;
      upstream.destroy();
      sendError(response, 413, "Request is too large. Maximum request size is 4.5 MB.");
    } else {
      upstream.destroy();
      sendError(response, 502, "The request could not be forwarded to the Render backend.");
    }
  });
  request.pipe(sizeLimit).pipe(upstream);
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
