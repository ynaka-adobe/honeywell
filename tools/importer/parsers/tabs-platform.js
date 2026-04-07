/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-platform. Base: tabs.
 * Source: https://www.honeywell.com/us/en
 * Tabs block: 2 columns per row. Cell 1 = tab label, Cell 2 = tab content.
 * DOM: 3 tabs (Purpose-Built Platforms, Industrial-Focused AI, OT-Centric Cybersecurity)
 * with content panels containing h5 heading, paragraph, CTA link, and background image.
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

      const pane = tabPanes[i];
      const contentCell = [];

      if (pane) {
        // Extract background image
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

        // Extract heading
        const heading = pane.querySelector('h2, h3, h4, h5, h6');
        if (heading) contentCell.push(heading);

        // Extract description paragraph
        const paras = pane.querySelectorAll('p');
        paras.forEach((p) => {
          if (p.textContent.trim() && p.textContent.trim().length > 10) {
            contentCell.push(p);
          }
        });

        // Extract CTA links
        const links = pane.querySelectorAll('a.cmp-call-to-action, a[class*="cta"], a[href*="/us/en/"]');
        links.forEach((a) => contentCell.push(a));
      }

      if (contentCell.length === 0) {
        const p = document.createElement('p');
        p.textContent = label;
        contentCell.push(p);
      }

      cells.push([label, contentCell]);
    });
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-platform', cells });
  element.replaceWith(block);
}
