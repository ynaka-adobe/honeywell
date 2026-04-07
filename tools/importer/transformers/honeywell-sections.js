/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Honeywell section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections.
 * Selectors from captured DOM of https://www.honeywell.com/us/en
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      // Try each selector (array or string)
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;

      for (const sel of selectors) {
        try {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        } catch (e) {
          // Invalid selector, try next
        }
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add section break (<hr>) before each section except the first
      if (section !== sections[0] && section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
