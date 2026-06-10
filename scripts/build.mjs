#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const siteDir = path.join(root, 'site');
const pagesDir = path.join(root, 'pages');
const sourceDir = path.join(root, 'source');
const templatesDir = path.join(root, 'templates');

const SITE_URL = 'https://hazalhotel.com';

const CONTACT_SCRIPT = `<script>
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = (form.querySelector('[name="name-surname"]') || {}).value || '';
    var phone = (form.querySelector('[name="telephone"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    var message = (form.querySelector('[name="mesajınız"]') || {}).value || '';
    var subject = encodeURIComponent('Hazal Hotel İletişim Formu - ' + name);
    var body = encodeURIComponent(
      'Ad Soyad: ' + name + '\\n' +
      'Telefon: ' + phone + '\\n' +
      'E-posta: ' + email + '\\n\\n' +
      'Mesaj:\\n' + message
    );
    window.location.href = 'mailto:info@hazalhotel.com?subject=' + subject + '&body=' + body;
  });
})();
</script>`;

function readTemplate(name) {
  return fs.readFileSync(path.join(templatesDir, name), 'utf8');
}

function escapeHtmlAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function buildPage(meta, body) {
  const head = readTemplate('head.html')
    .replace('{{TITLE}}', escapeHtmlAttr(meta.title))
    .replace('{{DESCRIPTION}}', escapeHtmlAttr(meta.description))
    .replace('{{CANONICAL}}', meta.canonical);

  const header = readTemplate('header.html');
  const extraScripts = meta.extraScripts === 'contact' ? CONTACT_SCRIPT : '';
  const footer = readTemplate('footer.html').replace('{{EXTRA_SCRIPTS}}', extraScripts);

  return head + header + '\n' + body + '\n' + footer;
}

function writeSiteFile(relativePath, content) {
  const filePath = path.join(siteDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log(`Built ${relativePath}`);
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function buildSitemap(urls) {
  const entries = urls
    .map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function removeLegacyPhpPages() {
  for (const entry of fs.readdirSync(siteDir)) {
    if (entry.endsWith('.php') && fs.statSync(path.join(siteDir, entry)).isFile()) {
      fs.unlinkSync(path.join(siteDir, entry));
      console.log(`Removed legacy ${entry}`);
    }
  }
}

removeLegacyPhpPages();

const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'));
const sitemapUrls = [`${SITE_URL}/`];

for (const pageFile of pageFiles.sort()) {
  const meta = JSON.parse(fs.readFileSync(path.join(pagesDir, pageFile), 'utf8'));
  const body = fs.readFileSync(path.join(sourceDir, `${meta.slug}.html`), 'utf8');
  const html = buildPage(meta, body);

  writeSiteFile(meta.output, html);

  if (meta.output !== 'index.html') {
    sitemapUrls.push(`${SITE_URL}/${meta.output}`);
  }
}

writeSiteFile('robots.txt', buildRobots());
writeSiteFile('sitemap.xml', buildSitemap([...new Set(sitemapUrls)]));
writeSiteFile('CNAME', 'hazalhotel.com\n');
writeSiteFile('.nojekyll', '');

console.log('Build complete.');
