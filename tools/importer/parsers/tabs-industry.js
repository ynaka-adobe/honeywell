/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-industry. Base: tabs.
 * Source: https://www.honeywell.com/us/en
 * Tabs block: 2 columns per row. Cell 1 = tab label, Cell 2 = tab content.
 * DOM: .cmp-leftrail-enhanced contains left-rail tabs with industry names
 * (Aerospace, Commercial Buildings, etc.) and corresponding tab panes with
 * background images from Scene7.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find tab buttons/labels
  const tabLabels = element.querySelectorAll('.left-rail-tabs li, .nav-tabs li, [role="tab"]');
  // Find tab panes
  const tabPanes = element.querySelectorAll('.tab-pane, [role="tabpanel"]');

  if (tabLabels.length > 0) {
    tabLabels.forEach((tab, i) => {
      const label = tab.textContent.trim();
      if (!label) return;

      // Get corresponding tab pane content
      const pane = tabPanes[i];
      const contentCell = [];

      if (pane) {
        // Look for background images in the pane
        const bgEl = pane.querySelector('[style*="background-image"]');
        if (bgEl) {
          const style = bgEl.getAttribute('style') || '';
          const match = style.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) {
            let src = match[1];
            if (src.includes('scene7.com') && !src.includes('?wid=')) {
              src = src + '?wid=1560&fmt=jpg&qlt=85';
            }
            const img = document.createElement('img');
            img.src = src;
            img.alt = label;
            contentCell.push(img);
          }
        }

        // Get text content from the pane
        const headings = pane.querySelectorAll('h2, h3, h4, h5, h6');
        headings.forEach((h) => contentCell.push(h));

        const paras = pane.querySelectorAll('p');
        paras.forEach((p) => {
          if (p.textContent.trim()) contentCell.push(p);
        });

        const links = pane.querySelectorAll('a[href*="/us/en/"]');
        links.forEach((a) => contentCell.push(a));
      }

      // If no pane content found, just add label as content
      if (contentCell.length === 0) {
        const p = document.createElement('p');
        p.textContent = label;
        contentCell.push(p);
      }

      cells.push([label, contentCell]);
    });
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-industry', cells });
  element.replaceWith(block);
}
