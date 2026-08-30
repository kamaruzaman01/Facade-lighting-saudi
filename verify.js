// Regression audit against the running preview: bun run verify.js
import assert from 'node:assert/strict';
const base = 'http://localhost:3000';
const sections = ['', 'about', 'services', 'projects', 'contact'];
const routes = sections.flatMap(page => [page ? '/' + page : '/', '/ar' + (page ? '/' + page : '')]);
const resources = new Set();
const titles = new Set();
for (const route of routes) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    const ar = route.startsWith('/ar');
    assert.ok(html.includes(ar ? '<html lang="ar" dir="rtl">' : '<html lang="en">'), route + ' language');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, route + ' heading');
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert.ok(title && !titles.has(title), route + ' unique title');
    titles.add(title);
    assert.ok(html.includes('info@starfacadelighting.com'));
    assert.ok(html.includes('+971 4 330 6778'));
    assert.ok(html.includes('+971 56 997 3500'));
    assert.ok(html.includes('https://wa.me/971569973500'));
    const suffix = ar ? route.slice(3) : route === '/' ? '' : route;
    for (const [language, path] of [['en-SA', suffix || '/'], ['ar-SA', '/ar' + suffix], ['x-default', suffix || '/']]) {
        const link = html.match(new RegExp('hreflang="' + language + '" href="([^"]+)"'))?.[1];
        assert.ok(link && new URL(link).pathname === path, route + ' alternate ' + language);
    }
    await new HTMLRewriter().on('a[href], img[src], script[src], link[href]', { element(e) {
        const ref = e.getAttribute('href') || e.getAttribute('src');
        if (ref.startsWith('/')) resources.add(ref);
    } }).transform(new Response(html)).text();
    if (ar) {
        let body = '';
        await new HTMLRewriter().on('body', { text(t) { body += t.text; } }).transform(new Response(html)).text();
        const remaining = body.replace(/&(?:[a-z]+|#\d+|#x[\da-f]+);/gi, '').replaceAll('info@starfacadelighting.com', '').replace(/English|LED|IP/g, '');
        assert.ok(!/[a-z]/i.test(remaining), route + ' untranslated body text');
    }
}
for (const resource of resources) assert.equal((await fetch(base + resource)).status, 200, resource);
assert.equal((await fetch(base + '/ar/contact/')).url, base + '/ar/contact');
assert.equal((await fetch(base + '/not-a-page')).status, 404);
assert.equal((await fetch(base + '/build.js')).status, 404);
const preview = await fetch(base + '/send_email.php', { method: 'POST' });
assert.equal(preview.status, 503);
assert.equal((await preview.json()).code, 'preview_unavailable');
console.log(`PASS: ${routes.length} routes, ${resources.size} internal links/assets, language/SEO pairs, Arabic text coverage, contacts, redirects and safe preview behavior.`);
