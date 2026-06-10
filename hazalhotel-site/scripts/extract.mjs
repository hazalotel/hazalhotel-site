#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const backupDir = path.join(root, '..', 'homedir', 'public_html');
const sourceDir = path.join(root, 'source');
const pagesDir = path.join(root, 'pages');

const SITE_URL = 'https://hazalhotel.com';
const ISTBOOKING = 'https://hazalhotel.istbooking.com/';

const PAGE_FILES = [
  'index.php',
  'hakkimizda.php',
  'odalarimiz.php',
  'standart-oda.php',
  'aile-odasi.php',
  'suit-oda.php',
  'deniz-manzarali-oda.php',
  'galeri.php',
  'iletisim.php',
  'aktiviteler.php',
  'rezervasyon.php',
  'kvkk.php',
  'cerez-politikasi.php',
  'gizlilik-sozlesmesi.php',
  'aydinlatma-metni.php',
];

const DESCRIPTION_OVERRIDES = {
  'index.php': 'Karasu otelleri arasında en iyi hizmeti veren Hazal Hotel, butik oteli hizmeti vermektedir. En popüler karasu oteli',
  'hakkimizda.php': 'Hazal Hotel, Sakarya Karasu muhteşem deniz manzarası ve modern yapısı ile siz değerli misafirlerimizin hizmetindedir.',
  'odalarimiz.php': 'Zarif ve modern mimarisiyle eşsiz manzaraya sahip odalarımızda huzur dolu anlar sizi bekliyor.',
  'standart-oda.php': 'Gün ışığı alan modern mimarisi ile eşsiz manzaraya sahip otelimizde huzur dolu anlar sizi bekliyor.',
  'aile-odasi.php': 'Gün ışığı alan modern mimarisi ile eşsiz manzaraya sahip otelimizde huzur dolu anlar sizi bekliyor.',
  'suit-oda.php': 'Gün ışığı alan modern mimarisi ile eşsiz manzaraya sahip otelimizde huzur dolu anlar sizi bekliyor.',
  'deniz-manzarali-oda.php': 'Gün ışığı alan modern mimarisi ile eşsiz manzaraya sahip otelimizde huzur dolu anlar sizi bekliyor.',
  'galeri.php': "Karasu'dan ve otelimizden fotoğraflar, Karasu doğa fotoğrafları ve Sakarya deniz fotoğrafları.",
  'iletisim.php': 'Konaklamanız öncesinde, sırasında ve sonrasında meydana gelen herhangi bir olay hakkında bize bilgi vermek için bu kısmı kullanabilirsiniz.',
  'aktiviteler.php': 'Hazal Hotel Karasu aktiviteler, olanaklar ve hizmetler hakkında bilgi alın.',
  'rezervasyon.php': 'Hazal Hotel resmi sitesinden güvenli online rezervasyon yapın.',
  'kvkk.php': 'Hazal Hotel kişisel verilerin korunması kanunu (KVKK) aydınlatma metni.',
  'cerez-politikasi.php': 'Hazal Hotel web sitesi çerez politikası ve kullanım bilgileri.',
  'gizlilik-sozlesmesi.php': 'Hazal Hotel gizlilik sözleşmesi ve veri işleme politikası.',
  'aydinlatma-metni.php': 'Hazal Hotel KVKK kapsamında aydınlatma metni.',
};

function extractTitle(content) {
  const match = content.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim() : 'Hazal Hotel';
}

function extractDescription(content) {
  const matches = [...content.matchAll(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/gi)];
  for (const match of matches) {
    if (match[1].trim()) {
      return match[1].trim();
    }
  }
  return '';
}

function extractBody(content) {
  const headerInclude = /<\?php\s+include\s+['"]header\.php['"];\s*\?>/i;
  const footerInclude = /<\?php\s+include\s+['"]footer\.php['"];\s*\?>/i;

  const headerMatch = content.match(headerInclude);
  const footerMatch = content.match(footerInclude);

  if (!headerMatch || !footerMatch) {
    throw new Error('Could not find header/footer includes');
  }

  const start = headerMatch.index + headerMatch[0].length;
  const end = footerMatch.index;
  return content.slice(start, end).trim();
}

function toHtmlFilename(phpFilename) {
  return phpFilename.replace(/\.php$/, '.html');
}

function fixInternalLinks(html) {
  return html.replace(/\.php(?=["'#? ])/g, '.html');
}

function postProcessBody(filename, body) {
  let result = body;

  if (filename === 'rezervasyon.php') {
    result = result.replace(/href="odeme\.php"/g, `href="${ISTBOOKING}"`);
    result = result.replace(/<div href="odeme\.php"/g, `<div href="${ISTBOOKING}"`);
  }

  if (filename === 'iletisim.php') {
    result = result.replace(
      '<form class="formDefault"',
      '<form class="formDefault" id="contactForm"'
    );
  }

  return fixInternalLinks(result);
}

function getCanonical(htmlFilename) {
  if (htmlFilename === 'index.html') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}/${htmlFilename}`;
}

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(pagesDir, { recursive: true });

for (const filename of PAGE_FILES) {
  const filePath = path.join(backupDir, filename);
  const content = fs.readFileSync(filePath, 'utf8');

  const title = extractTitle(content);
  let description = extractDescription(content) || DESCRIPTION_OVERRIDES[filename] || title;
  let body = extractBody(content);
  body = postProcessBody(filename, body);

  const slug = filename.replace(/\.php$/, '');
  fs.writeFileSync(path.join(sourceDir, `${slug}.html`), body);

  const pageMeta = {
    output: toHtmlFilename(filename),
    slug,
    title,
    description,
    canonical: getCanonical(toHtmlFilename(filename)),
  };

  if (filename === 'iletisim.php') {
    pageMeta.extraScripts = 'contact';
  }

  fs.writeFileSync(
    path.join(pagesDir, `${slug}.json`),
    JSON.stringify(pageMeta, null, 2) + '\n'
  );

  console.log(`Extracted ${filename}`);
}

console.log('Done.');
