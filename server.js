import { serve, file } from "bun";

const server = serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        let path = url.pathname;

        if (path === "/") path = "/index.html";

        const filePath = "." + path;
        const resource = file(filePath);

        return new Response(resource);
    },
});

console.log(`Listening on http://localhost:${server.port}`);
