#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const siteDir = path.join(root, 'docs');
const pagesDir = path.join(root, 'pages');
const sourceDir = path.join(root, 'source');
const templatesDir = path.join(root, 'templates');

const SITE_URL = 'https://hazalhotel.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/homeAbout1.jpg`;

const OG_IMAGES = {
  'standart-oda': `${SITE_URL}/assets/images/room/standart/2.jpeg`,
  'aile-odasi': `${SITE_URL}/assets/images/room/aile/1.jpg`,
  'suit-oda': `${SITE_URL}/assets/images/room/suit/1.jpg`,
  'deniz-manzarali-oda': `${SITE_URL}/assets/images/room/standart/1.jpeg`,
  'galeri': `${SITE_URL}/assets/images/gallery/1.jpg`,
  'hakkimizda': `${SITE_URL}/assets/images/homeAbout1.jpg`,
  'odalarimiz': `${SITE_URL}/assets/images/headerBanner/odalarimiz.jpg`,
  'iletisim': `${SITE_URL}/assets/images/headerBanner/iletisim.jpg`,
};

const OG_IMAGE_META = {
  default: { width: 309, height: 382, alt: 'Hazal Hotel Karasu — deniz manzaralı butik otel' },
  'standart-oda': { width: 1200, height: 1156, alt: 'Hazal Hotel standart oda' },
  'aile-odasi': { width: 1200, height: 798, alt: 'Hazal Hotel deniz manzaralı aile suiti' },
  'suit-oda': { width: 1200, height: 798, alt: 'Hazal Hotel jakuzili suit oda' },
  'deniz-manzarali-oda': { width: 1200, height: 1156, alt: 'Hazal Hotel deniz manzaralı oda' },
  galeri: { width: 1200, height: 798, alt: 'Hazal Hotel Karasu galeri' },
  hakkimizda: { width: 309, height: 382, alt: 'Hazal Hotel Karasu' },
  odalarimiz: { width: 1920, height: 445, alt: 'Hazal Hotel odalar' },
  iletisim: { width: 1920, height: 445, alt: 'Hazal Hotel iletişim' },
};

const ROOM_SCHEMAS = {
  'standart-oda': {
    name: 'Standart Oda',
    description: '20 m² lik odalarda, TV yayını, Ücretsiz kablosuz internet hizmeti.',
    floorSize: 20,
    occupancy: 2,
  },
  'deniz-manzarali-oda': {
    name: 'Deniz Manzaralı Oda',
    description: 'Panaromik deniz manzaralı odalarda, TV yayını, Kahvaltı Salonu, Ücretsiz kablosuz internet hizmeti.',
    floorSize: 20,
    occupancy: 2,
  },
  'aile-odasi': {
    name: 'Deniz Manzaralı Aile Suiti',
    description: '25 m² aile suiti: panoramik deniz manzarası, çift kişilik ve açılır-kapanır yatak. 4 kişilik konaklama.',
    floorSize: 25,
    occupancy: 4,
  },
  'suit-oda': {
    name: 'Jakuzili Suit Oda',
    description: '26 m² jakuzili suit: panoramik deniz manzarası, özel jakuzi, TV ve ücretsiz kablosuz internet.',
    floorSize: 26,
    occupancy: 2,
  },
};

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
    window.location.href = 'mailto:hazalotel2021@gmail.com?subject=' + subject + '&body=' + body;
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

function getOgImage(meta) {
  if (meta.ogImage) {
    return meta.ogImage.startsWith('http') ? meta.ogImage : `${SITE_URL}${meta.ogImage}`;
  }
  return OG_IMAGES[meta.slug] || DEFAULT_OG_IMAGE;
}

function getPageName(meta) {
  if (meta.breadcrumbName) return meta.breadcrumbName;
  return meta.title.split(' | ')[0];
}

function buildHotelSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'Hazal Hotel',
    url: `${SITE_URL}/`,
    telephone: '+905334787054',
    email: 'hazalotel2021@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Aziziye, Doğu Karadeniz Cd. No:170',
      addressLocality: 'Karasu',
      addressRegion: 'Sakarya',
      postalCode: '54500',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.098511621815575,
      longitude: 30.72186261572075,
    },
    sameAs: ['https://www.instagram.com/hazalhotelkarasu/'],
  };
}

function buildBreadcrumbSchema(meta, pageName) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: `${SITE_URL}/`,
    },
  ];

  if (meta.slug !== 'index') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: pageName,
      item: meta.canonical,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hazal Hotel',
    url: `${SITE_URL}/`,
    inLanguage: 'tr-TR',
  };
}

function getOgImageMeta(meta) {
  return OG_IMAGE_META[meta.slug] || OG_IMAGE_META.default;
}

function buildHotelRoomSchema(meta) {
  const room = ROOM_SCHEMAS[meta.slug];
  if (!room) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.description,
    url: meta.canonical,
    bed: {
      '@type': 'BedDetails',
      numberOfBeds: 1,
      typeOfBed: 'Double',
    },
    containedInPlace: {
      '@type': 'Hotel',
      name: 'Hazal Hotel',
      url: `${SITE_URL}/`,
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: room.floorSize,
      unitCode: 'MTK',
      unitText: 'm²',
    },
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: room.occupancy,
    },
  };
}

function buildJsonLd(meta) {
  const pageName = getPageName(meta);
  const schemas = [buildHotelSchema(), buildBreadcrumbSchema(meta, pageName)];

  if (meta.slug === 'index') {
    schemas.push(buildWebSiteSchema());
  }

  const roomSchema = buildHotelRoomSchema(meta);
  if (roomSchema) {
    schemas.push(roomSchema);
  }

  return `<script type="application/ld+json">\n${JSON.stringify(schemas, null, 2)}\n</script>`;
}

function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
}

function buildPage(meta, body) {
  const ogImage = getOgImage(meta);
  const ogMeta = getOgImageMeta(meta);
  const jsonLd = buildJsonLd(meta);
  const robotsMeta = meta.robots === 'noindex'
    ? '<meta name="robots" content="noindex, follow" />'
    : '';

  let head = readTemplate('head.html');
  head = replaceAll(head, '{{ROBOTS_META}}', robotsMeta);
  head = replaceAll(head, '{{TITLE}}', escapeHtmlAttr(meta.title));
  head = replaceAll(head, '{{DESCRIPTION}}', escapeHtmlAttr(meta.description));
  head = replaceAll(head, '{{CANONICAL}}', meta.canonical);
  head = replaceAll(head, '{{OG_TITLE}}', escapeHtmlAttr(meta.title));
  head = replaceAll(head, '{{OG_DESCRIPTION}}', escapeHtmlAttr(meta.description));
  head = replaceAll(head, '{{OG_URL}}', meta.canonical);
  head = replaceAll(head, '{{OG_IMAGE}}', ogImage);
  head = replaceAll(head, '{{OG_IMAGE_WIDTH}}', String(ogMeta.width));
  head = replaceAll(head, '{{OG_IMAGE_HEIGHT}}', String(ogMeta.height));
  head = replaceAll(head, '{{OG_IMAGE_ALT}}', escapeHtmlAttr(ogMeta.alt));
  head = replaceAll(head, '{{JSON_LD}}', jsonLd);

  const header = readTemplate('header.html');
  const extraScripts = meta.extraScripts === 'contact' ? CONTACT_SCRIPT : '';
  const footer = readTemplate('footer.html').replace('{{EXTRA_SCRIPTS}}', extraScripts);

  return `${head}${header}\n<main id="main-content">\n${body}\n</main>\n${footer}`;
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

function formatLastmod(filePath) {
  return fs.statSync(filePath).mtime.toISOString().split('T')[0];
}

function buildSitemap(entries) {
  const urlBlocks = entries
    .map(({ url, lastmod }) => {
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlBlocks}\n</urlset>\n`;
}

function removeLegacyPhpPages() {
  if (!fs.existsSync(siteDir)) return;

  for (const entry of fs.readdirSync(siteDir)) {
    if (entry.endsWith('.php') && fs.statSync(path.join(siteDir, entry)).isFile()) {
      fs.unlinkSync(path.join(siteDir, entry));
      console.log(`Removed legacy ${entry}`);
    }
  }
}

removeLegacyPhpPages();

const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'));
const sitemapEntries = [];

for (const pageFile of pageFiles.sort()) {
  const meta = JSON.parse(fs.readFileSync(path.join(pagesDir, pageFile), 'utf8'));
  const sourcePath = path.join(sourceDir, `${meta.slug}.html`);
  const body = fs.readFileSync(sourcePath, 'utf8');
  const html = buildPage(meta, body);

  writeSiteFile(meta.output, html);

  if (meta.sitemap !== false) {
    const url = meta.output === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${meta.output}`;
    sitemapEntries.push({ url, lastmod: formatLastmod(sourcePath) });
  }
}

writeSiteFile('robots.txt', buildRobots());
sitemapEntries.sort((a, b) => {
  if (a.url === `${SITE_URL}/`) return -1;
  if (b.url === `${SITE_URL}/`) return 1;
  return a.url.localeCompare(b.url);
});
writeSiteFile('sitemap.xml', buildSitemap(sitemapEntries));
writeSiteFile('.nojekyll', '');

console.log('Build complete.');
