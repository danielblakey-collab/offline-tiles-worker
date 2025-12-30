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

    return new Response(obj.body, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${key}"`,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  }
};
