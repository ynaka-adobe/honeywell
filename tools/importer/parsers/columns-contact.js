/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base: columns.
 * Source: https://www.honeywell.com/us/en
 * Columns block: 2 columns in 1 row.
 * DOM: Two side-by-side containers, each with:
 *   - Label paragraph (HELP & SUPPORT / SALES)
 *   - Description paragraph
 *   - CTA link (Get support / Talk To Sales)
 */
export default function parse(element, { document }) {
  // Find the two column containers - they are bg-white responsivegrid divs
  const columns = element.querySelectorAll(':scope > div > div, .bg-white, .responsivegrid');

  const col1Content = [];
  const col2Content = [];
  let currentCol = col1Content;
  let foundFirst = false;

  // Extract all text and link content, split into two columns
  const allParas = element.querySelectorAll('p');
  const allLinks = element.querySelectorAll('a.cmp-call-to-action, a[class*="cta"]');

  // Strategy: find pairs of label+description+CTA
  const labels = [];
  const descriptions = [];
  const ctas = [];

  allParas.forEach((p) => {
    const text = p.textContent.trim();
    if (!text) return;
    if (text === 'HELP & SUPPORT' || text === 'SALES') {
      labels.push(p);
    } else if (text.length > 10) {
      descriptions.push(p);
    }
  });

  allLinks.forEach((a) => {
    if (a.textContent.trim()) {
      ctas.push(a);
    }
  });

  // Build two columns
  if (labels.length >= 2) {
    // Column 1: first label + first description + first CTA
    if (labels[0]) col1Content.push(labels[0]);
    if (descriptions[0]) col1Content.push(descriptions[0]);
    if (ctas[0]) col1Content.push(ctas[0]);

    // Column 2: second label + second description + second CTA
    if (labels[1]) col2Content.push(labels[1]);
    if (descriptions[1]) col2Content.push(descriptions[1]);
    if (ctas[1]) col2Content.push(ctas[1]);
  }

  if (col1Content.length === 0 && col2Content.length === 0) return;

  const cells = [
    [col1Content, col2Content],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
