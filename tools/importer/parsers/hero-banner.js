/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.honeywell.com/us/en
 * Hero block: 1 column, row 1 = background image, row 2 = heading + text + CTA
 * DOM: #hero-banner has bg image via CSS, h1, p, and .cta a link.
 */
export default function parse(element, { document }) {
  // Extract background image - check CSS background-image or picture/img elements
  let bgImage = null;

  // Try inline style background-image on any child
  const bgEl = element.querySelector('[style*="background-image"]');
  if (bgEl) {
    const style = bgEl.getAttribute('style') || '';
    const match = style.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) {
      let src = match[1];
      if (src.includes('scene7.com') && !src.includes('?wid=')) {
        src = src + '?wid=1560&fmt=jpg&qlt=85';
      }
      bgImage = document.createElement('img');
      bgImage.src = src;
      bgImage.alt = '';
    }
  }

  // Fallback: find a large picture/img element
  if (!bgImage) {
    const pic = element.querySelector('picture, img[class*="hero"], img[class*="banner"]');
    if (pic) {
      bgImage = pic;
    }
  }

  // Extract heading
  const heading = element.querySelector('h1, h2, h3');

  // Extract description - get the paragraph that is NOT inside the heading
  const paragraphs = element.querySelectorAll('p');
  let description = null;
  for (const p of paragraphs) {
    if (p.textContent.trim() && !p.closest('h1, h2, h3') && p.textContent.trim().length > 10) {
      description = p;
      break;
    }
  }

  // Extract CTA link
  const cta = element.querySelector('.cta a, a.cmp-call-to-action, a[class*="cta"]');

  // Build cells per hero block library:
  // Row 1: background image (single cell)
  // Row 2: heading + description + CTA (single cell, all content together)
  const cells = [];

  if (bgImage) {
    cells.push([bgImage]);
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
