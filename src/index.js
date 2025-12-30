export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, ""); // e.g. "ugashik.mbtiles"

    if (!key) {
      return new Response("OK. Request /<district>.mbtiles", { status: 200 });
    }

    if (!key.toLowerCase().endsWith(".mbtiles")) {
      return new Response("Not found", { status: 404 });
    }

    const obj = await env.MBTILES_BUCKET.get(key);
    if (!obj) {
      return new Response(`File not found: ${key}`, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${key}"`);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Accept-Ranges", "bytes");
    if (obj.size != null) headers.set("Content-Length", String(obj.size));
    if (obj.etag) headers.set("ETag", obj.etag);

    // HEAD should return headers only (no body)
    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(obj.body, { status: 200, headers });
  },
};
