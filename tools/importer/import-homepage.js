/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsMegatrendParser from './parsers/cards-megatrend.js';
import tabsIndustryParser from './parsers/tabs-industry.js';
import carouselNewsParser from './parsers/carousel-news.js';
import tabsPlatformParser from './parsers/tabs-platform.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import honeywellCleanupTransformer from './transformers/honeywell-cleanup.js';
import honeywellSectionsTransformer from './transformers/honeywell-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-megatrend': cardsMegatrendParser,
  'tabs-industry': tabsIndustryParser,
  'carousel-news': carouselNewsParser,
  'tabs-platform': tabsPlatformParser,
  'columns-contact': columnsContactParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Honeywell US homepage with hero, featured content, and promotional sections',
  urls: [
    'https://www.honeywell.com/us/en',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['#hero-banner'],
    },
    {
      name: 'cards-megatrend',
      instances: ['.section.responsivegrid > .cmp-section-container-preview-mode .sectiontitle + .responsivegrid'],
    },
    {
      name: 'tabs-industry',
      instances: ['.cmp-leftrail-enhanced'],
    },
    {
      name: 'carousel-news',
      instances: ['.section.responsivegrid.pt-0.pb-20 .cmp-image__link'],
    },
    {
      name: 'tabs-platform',
      instances: ['.section.responsivegrid.pt-0.overlap-bottom .nav-tabs.left-rail-tabs'],
    },
    {
      name: 'columns-contact',
      instances: ['.section.responsivegrid.pt-0.overlap-bottom .bg-white'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: '#hero-banner',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2-megatrends',
      name: 'Delivering Mega Results on Mega Trends',
      selector: '.section.responsivegrid:not(.pt-0)',
      style: null,
      blocks: ['cards-megatrend'],
      defaultContent: ['.sectiontitle h2.section-title', '.sectiontitle h6'],
    },
    {
      id: 'section-3-what-we-do',
      name: 'What We Do',
      selector: '.section.responsivegrid.pt-0.pb-20',
      style: 'dark',
      blocks: ['tabs-industry'],
      defaultContent: ['.sectiontitle h2.section-title'],
    },
    {
      id: 'section-4-whats-new',
      name: 'Whats New',
      selector: ['.section.responsivegrid.pt-0.pb-20 ~ .section.responsivegrid.pt-0:not(.pb-20):not(.overlap-bottom)'],
      style: null,
      blocks: ['carousel-news'],
      defaultContent: ['.sectiontitle h2.section-title'],
    },
    {
      id: 'section-5-digitalization',
      name: 'The Next Step Change in Industrial Digitalization',
      selector: '.section.responsivegrid.pt-0.overlap-bottom',
      style: 'light-gray',
      blocks: ['tabs-platform'],
      defaultContent: ['.sectiontitle h2', '.sectiontitle h6'],
    },
    {
      id: 'section-6-contact',
      name: 'Contact Section',
      selector: '.section.responsivegrid.pt-0.overlap-bottom .bg-white',
      style: 'dark',
      blocks: ['columns-contact'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  honeywellCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [honeywellSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`, e);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
