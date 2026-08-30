# Facade Lighting Saudi — English / Arabic

The homepage preserves the original English content, images and branding. Both
languages have static HTML routes for home, about, services, projects and contact.
The original external Products catalogue remains an external English resource;
it is not part of this repository. There were no FAQs in the original website.

## Local preview

Run `bun run build.js`, then `bun run server.js`. Open
http://localhost:3000 or http://localhost:3000/ar.

Run `bun run verify.js` while the preview is running to audit all ten routes,
local links and assets, Arabic text coverage, SEO pairs and unchanged contact data.

## Content changes

Edit `templates/home.html` for English content, and `build.js` for Arabic content,
page composition and SEO. Rebuild after editing either file. Do not edit generated
`index.html` files directly. Styles and interactions live in `style.css` and
`script.js` and apply to both languages.

## Production

Set `SITE_URL` to the real production origin before rebuilding, e.g. in PowerShell:

```powershell
$env:SITE_URL = 'https://your-production-domain.example'
bun run build.js
```

This writes absolute canonical and reciprocal en-SA/ar-SA/x-default URLs.
The default origin is localhost for preview; do not deploy with localhost SEO URLs.
Publish generated HTML directories, assets, style.css, script.js and send_email.php.
Configure the production web server to serve directory index.html files at the
extensionless routes and to execute PHP for `/send_email.php`. Do not publish
templates or build tooling as public content. No deployment has been performed.

The Bun preview server intentionally returns a localized unavailable message for
form submissions, because it cannot execute PHP. Production email requires the
existing PHP mail transport to be configured; delivery must be verified on that
host. The recipient, phone and WhatsApp numbers remain unchanged.
