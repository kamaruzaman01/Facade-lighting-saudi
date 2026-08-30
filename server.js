import { serve, file } from 'bun';
const pages = new Set(['/', '/about', '/services', '/projects', '/contact', '/ar', '/ar/about', '/ar/services', '/ar/projects', '/ar/contact']);
const server = serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;
        // The preview server cannot execute PHP. Never expose backend source.
        if (path === '/send_email.php') return Response.json({ status: 'error', code: 'preview_unavailable' }, { status: 503 });
        if (!['GET', 'HEAD'].includes(req.method)) return new Response('Method not allowed', { status: 405 });
        const clean = path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
        if (pages.has(clean)) {
            if (path !== clean) return Response.redirect(new URL(clean + url.search, url), 301);
            return new Response(file(clean === '/' ? './index.html' : '.' + clean + '/index.html'));
        }
        if (['/style.css', '/script.js'].includes(path) || /^\/assets\/[\w .-]+$/.test(path)) {
            const resource = file('.' + path);
            if (await resource.exists()) return new Response(resource);
        }
        return new Response('404 — Page not found / الصفحة غير موجودة', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
});
console.log(`Listening on http://localhost:${server.port}`);
