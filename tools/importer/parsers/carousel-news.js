/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-news. Base: carousel.
 * Source: https://www.honeywell.com/us/en
 * Carousel block: 2 columns per row. Cell 1 = image, Cell 2 = title + link.
 * DOM: News carousel with 6 articles, each with lazy-loaded image (data-src from Scene7)
 * and h2 headline linking to article page.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find news article items - they are list items or repeated card-like divs
  const items = element.querySelectorAll('li, [class*="mosaic"] > div, .cmp-image__link');

  if (items.length > 0) {
    items.forEach((item) => {
      // Find the image - check data-src for lazy loaded, then src
      const img = item.querySelector('img');
      if (!img) return;

      let imgEl = img.cloneNode(true);
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        let src = dataSrc;
        if (src.includes('scene7.com') && !src.includes('?wid=')) {
          src = src + '?wid=800&fmt=jpg&qlt=85';
        }
        imgEl.src = src;
      } else if (imgEl.src && imgEl.src.includes('scene7.com') && !imgEl.src.includes('?wid=')) {
        imgEl.src = imgEl.src + '?wid=800&fmt=jpg&qlt=85';
      }

      // Skip placeholder images
      if (imgEl.src && imgEl.src.includes('placeholder')) return;

      // Find the headline and link
      const headingLink = item.querySelector('h2 a, a h2, a[href*="/news/"], a[href*="/press/"]');
      const heading = item.querySelector('h2, h3');

      const contentCell = [];
      if (heading) {
        contentCell.push(heading);
      } else if (headingLink) {
        contentCell.push(headingLink);
      }

      if (contentCell.length > 0) {
        cells.push([imgEl, contentCell]);
      }
    });
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-news', cells });
  element.replaceWith(block);
}
