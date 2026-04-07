/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-megatrend. Base: cards.
 * Source: https://www.honeywell.com/us/en
 * Cards block: 2 columns per row. Cell 1 = image, Cell 2 = label link + description.
 * DOM: 3 cards with square images, linked category labels (AUTOMATION, ENERGY TRANSITION, AVIATION),
 * and h6 descriptions. Images from Scene7 at 576x576 rendered at ~52x52.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find the card containers - each has an image link and text content
  const cardContainers = element.querySelectorAll(':scope > div > div, .responsivegrid > .aem-Grid > .responsivegrid');

  // Fallback: look for image+text pairs
  const images = element.querySelectorAll('img[src*="scene7.com"], .cmp-image__link img');
  const headings = element.querySelectorAll('h6, h5');
  const links = element.querySelectorAll('a[href*="/us/en/"]');

  if (images.length > 0 && headings.length > 0) {
    // Pair images with their corresponding text content
    const usedImages = new Set();

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      // Find the closest image to this heading (within same parent container)
      const parentSection = heading.closest('.responsivegrid, .aem-Grid, div[class*="aem-GridColumn"]');
      let img = null;

      if (parentSection) {
        img = parentSection.querySelector('img[src*="scene7.com"]');
      }

      // Fallback: use images by index
      if (!img && i < images.length) {
        img = images[i];
      }

      if (img && !usedImages.has(img.src)) {
        usedImages.add(img.src);

        // Resize high-res Scene7 images to appropriate rendition
        let imgEl = img.cloneNode(true);
        if (imgEl.src && imgEl.src.includes('scene7.com') && !imgEl.src.includes('?wid=')) {
          imgEl.src = imgEl.src + '?wid=104&fmt=jpg&qlt=85';
        }

        // Build text cell: category label link + description
        const textCell = [];

        // Find the category label link near this heading
        const labelLink = heading.closest('.responsivegrid, .aem-GridColumn')?.querySelector('a[href*="/us/en/"]');
        if (labelLink) textCell.push(labelLink);

        textCell.push(heading);

        cells.push([imgEl, textCell]);
      }
    }
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-megatrend', cells });
  element.replaceWith(block);
}
