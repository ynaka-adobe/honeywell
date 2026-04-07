var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    let bgImage = null;
    const bgEl = element.querySelector('[style*="background-image"]');
    if (bgEl) {
      const style = bgEl.getAttribute("style") || "";
      const match = style.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) {
        let src = match[1];
        if (src.includes("scene7.com") && !src.includes("?wid=")) {
          src = src + "?wid=1560&fmt=jpg&qlt=85";
        }
        bgImage = document.createElement("img");
        bgImage.src = src;
        bgImage.alt = "";
      }
    }
    if (!bgImage) {
      const pic = element.querySelector('picture, img[class*="hero"], img[class*="banner"]');
      if (pic) {
        bgImage = pic;
      }
    }
    const heading = element.querySelector("h1, h2, h3");
    const paragraphs = element.querySelectorAll("p");
    let description = null;
    for (const p of paragraphs) {
      if (p.textContent.trim() && !p.closest("h1, h2, h3") && p.textContent.trim().length > 10) {
        description = p;
        break;
      }
    }
    const cta = element.querySelector('.cta a, a.cmp-call-to-action, a[class*="cta"]');
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
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-megatrend.js
  function parse2(element, { document }) {
    var _a;
    const cells = [];
    const cardContainers = element.querySelectorAll(":scope > div > div, .responsivegrid > .aem-Grid > .responsivegrid");
    const images = element.querySelectorAll('img[src*="scene7.com"], .cmp-image__link img');
    const headings = element.querySelectorAll("h6, h5");
    const links = element.querySelectorAll('a[href*="/us/en/"]');
    if (images.length > 0 && headings.length > 0) {
      const usedImages = /* @__PURE__ */ new Set();
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const parentSection = heading.closest('.responsivegrid, .aem-Grid, div[class*="aem-GridColumn"]');
        let img = null;
        if (parentSection) {
          img = parentSection.querySelector('img[src*="scene7.com"]');
        }
        if (!img && i < images.length) {
          img = images[i];
        }
        if (img && !usedImages.has(img.src)) {
          usedImages.add(img.src);
          let imgEl = img.cloneNode(true);
          if (imgEl.src && imgEl.src.includes("scene7.com") && !imgEl.src.includes("?wid=")) {
            imgEl.src = imgEl.src + "?wid=104&fmt=jpg&qlt=85";
          }
          const textCell = [];
          const labelLink = (_a = heading.closest(".responsivegrid, .aem-GridColumn")) == null ? void 0 : _a.querySelector('a[href*="/us/en/"]');
          if (labelLink) textCell.push(labelLink);
          textCell.push(heading);
          cells.push([imgEl, textCell]);
        }
      }
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-megatrend", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-industry.js
  function parse3(element, { document }) {
    const cells = [];
    const tabLabels = element.querySelectorAll('.left-rail-tabs li, .nav-tabs li, [role="tab"]');
    const tabPanes = element.querySelectorAll('.tab-pane, [role="tabpanel"]');
    if (tabLabels.length > 0) {
      tabLabels.forEach((tab, i) => {
        const label = tab.textContent.trim();
        if (!label) return;
        const pane = tabPanes[i];
        const contentCell = [];
        if (pane) {
          const bgEl = pane.querySelector('[style*="background-image"]');
          if (bgEl) {
            const style = bgEl.getAttribute("style") || "";
            const match = style.match(/url\(["']?([^"')]+)["']?\)/);
            if (match) {
              let src = match[1];
              if (src.includes("scene7.com") && !src.includes("?wid=")) {
                src = src + "?wid=1560&fmt=jpg&qlt=85";
              }
              const img = document.createElement("img");
              img.src = src;
              img.alt = label;
              contentCell.push(img);
            }
          }
          const headings = pane.querySelectorAll("h2, h3, h4, h5, h6");
          headings.forEach((h) => contentCell.push(h));
          const paras = pane.querySelectorAll("p");
          paras.forEach((p) => {
            if (p.textContent.trim()) contentCell.push(p);
          });
          const links = pane.querySelectorAll('a[href*="/us/en/"]');
          links.forEach((a) => contentCell.push(a));
        }
        if (contentCell.length === 0) {
          const p = document.createElement("p");
          p.textContent = label;
          contentCell.push(p);
        }
        cells.push([label, contentCell]);
      });
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-industry", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-news.js
  function parse4(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll('li, [class*="mosaic"] > div, .cmp-image__link');
    if (items.length > 0) {
      items.forEach((item) => {
        const img = item.querySelector("img");
        if (!img) return;
        let imgEl = img.cloneNode(true);
        const dataSrc = img.getAttribute("data-src");
        if (dataSrc) {
          let src = dataSrc;
          if (src.includes("scene7.com") && !src.includes("?wid=")) {
            src = src + "?wid=800&fmt=jpg&qlt=85";
          }
          imgEl.src = src;
        } else if (imgEl.src && imgEl.src.includes("scene7.com") && !imgEl.src.includes("?wid=")) {
          imgEl.src = imgEl.src + "?wid=800&fmt=jpg&qlt=85";
        }
        if (imgEl.src && imgEl.src.includes("placeholder")) return;
        const headingLink = item.querySelector('h2 a, a h2, a[href*="/news/"], a[href*="/press/"]');
        const heading = item.querySelector("h2, h3");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-platform.js
  function parse5(element, { document }) {
    const cells = [];
    const tabLabels = element.querySelectorAll('.left-rail-tabs li, .nav-tabs li, [role="tab"]');
    const tabPanes = element.querySelectorAll('.tab-pane, [role="tabpanel"]');
    if (tabLabels.length > 0) {
      tabLabels.forEach((tab, i) => {
        const label = tab.textContent.trim();
        if (!label) return;
        const pane = tabPanes[i];
        const contentCell = [];
        if (pane) {
          const bgEl = pane.querySelector('[style*="background-image"]');
          if (bgEl) {
            const style = bgEl.getAttribute("style") || "";
            const match = style.match(/url\(["']?([^"')]+)["']?\)/);
            if (match) {
              let src = match[1];
              if (src.includes("scene7.com") && !src.includes("?wid=")) {
                src = src + "?wid=1560&fmt=jpg&qlt=85";
              }
              const img = document.createElement("img");
              img.src = src;
              img.alt = label;
              contentCell.push(img);
            }
          }
          const heading = pane.querySelector("h2, h3, h4, h5, h6");
          if (heading) contentCell.push(heading);
          const paras = pane.querySelectorAll("p");
          paras.forEach((p) => {
            if (p.textContent.trim() && p.textContent.trim().length > 10) {
              contentCell.push(p);
            }
          });
          const links = pane.querySelectorAll('a.cmp-call-to-action, a[class*="cta"], a[href*="/us/en/"]');
          links.forEach((a) => contentCell.push(a));
        }
        if (contentCell.length === 0) {
          const p = document.createElement("p");
          p.textContent = label;
          contentCell.push(p);
        }
        cells.push([label, contentCell]);
      });
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-platform", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse6(element, { document }) {
    const columns = element.querySelectorAll(":scope > div > div, .bg-white, .responsivegrid");
    const col1Content = [];
    const col2Content = [];
    let currentCol = col1Content;
    let foundFirst = false;
    const allParas = element.querySelectorAll("p");
    const allLinks = element.querySelectorAll('a.cmp-call-to-action, a[class*="cta"]');
    const labels = [];
    const descriptions = [];
    const ctas = [];
    allParas.forEach((p) => {
      const text = p.textContent.trim();
      if (!text) return;
      if (text === "HELP & SUPPORT" || text === "SALES") {
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
    if (labels.length >= 2) {
      if (labels[0]) col1Content.push(labels[0]);
      if (descriptions[0]) col1Content.push(descriptions[0]);
      if (ctas[0]) col1Content.push(ctas[0]);
      if (labels[1]) col2Content.push(labels[1]);
      if (descriptions[1]) col2Content.push(descriptions[1]);
      if (ctas[1]) col2Content.push(ctas[1]);
    }
    if (col1Content.length === 0 && col2Content.length === 0) return;
    const cells = [
      [col1Content, col2Content]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/honeywell-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="onetrust"]',
        '[class*="cookie"]',
        "#CybotCookiebotDialog"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-cls-v2",
        ".cmp-cls-v2-flyOut"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".search-bar-takeover__container"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        "header",
        "footer",
        "nav",
        ".global-header-container",
        "#navigationV2Container",
        "#standard-flyout-nav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        'img[src*="bat.bing.com"]',
        'img[src*="t.co/"]',
        'img[src*="analytics.twitter"]',
        'img[src*="rlcdn.com"]',
        'img[src*="id.rlcdn.com"]'
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-cmp-data-layer");
      });
    }
  }

  // tools/importer/transformers/honeywell-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
            if (sectionEl) break;
          } catch (e) {
          }
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section !== sections[0] && section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-megatrend": parse2,
    "tabs-industry": parse3,
    "carousel-news": parse4,
    "tabs-platform": parse5,
    "columns-contact": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Honeywell US homepage with hero, featured content, and promotional sections",
    urls: [
      "https://www.honeywell.com/us/en"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: ["#hero-banner"]
      },
      {
        name: "cards-megatrend",
        instances: [".section.responsivegrid > .cmp-section-container-preview-mode .sectiontitle + .responsivegrid"]
      },
      {
        name: "tabs-industry",
        instances: [".cmp-leftrail-enhanced"]
      },
      {
        name: "carousel-news",
        instances: [".section.responsivegrid.pt-0.pb-20 .cmp-image__link"]
      },
      {
        name: "tabs-platform",
        instances: [".section.responsivegrid.pt-0.overlap-bottom .nav-tabs.left-rail-tabs"]
      },
      {
        name: "columns-contact",
        instances: [".section.responsivegrid.pt-0.overlap-bottom .bg-white"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: "#hero-banner",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2-megatrends",
        name: "Delivering Mega Results on Mega Trends",
        selector: ".section.responsivegrid:not(.pt-0)",
        style: null,
        blocks: ["cards-megatrend"],
        defaultContent: [".sectiontitle h2.section-title", ".sectiontitle h6"]
      },
      {
        id: "section-3-what-we-do",
        name: "What We Do",
        selector: ".section.responsivegrid.pt-0.pb-20",
        style: "dark",
        blocks: ["tabs-industry"],
        defaultContent: [".sectiontitle h2.section-title"]
      },
      {
        id: "section-4-whats-new",
        name: "Whats New",
        selector: [".section.responsivegrid.pt-0.pb-20 ~ .section.responsivegrid.pt-0:not(.pb-20):not(.overlap-bottom)"],
        style: null,
        blocks: ["carousel-news"],
        defaultContent: [".sectiontitle h2.section-title"]
      },
      {
        id: "section-5-digitalization",
        name: "The Next Step Change in Industrial Digitalization",
        selector: ".section.responsivegrid.pt-0.overlap-bottom",
        style: "light-gray",
        blocks: ["tabs-platform"],
        defaultContent: [".sectiontitle h2", ".sectiontitle h6"]
      },
      {
        id: "section-6-contact",
        name: "Contact Section",
        selector: ".section.responsivegrid.pt-0.overlap-bottom .bg-white",
        style: "dark",
        blocks: ["columns-contact"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
              section: blockDef.section || null
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
