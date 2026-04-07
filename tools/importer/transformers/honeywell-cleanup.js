/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Honeywell site cleanup.
 * Selectors from captured DOM of https://www.honeywell.com/us/en
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent banners (found: OneTrust, cookie dialogs)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '[class*="cookie"]',
      '#CybotCookiebotDialog',
    ]);

    // Remove country/language selector modal
    WebImporter.DOMUtils.remove(element, [
      '.cmp-cls-v2',
      '.cmp-cls-v2-flyOut',
    ]);

    // Remove search overlay
    WebImporter.DOMUtils.remove(element, [
      '.search-bar-takeover__container',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, nav
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      'header',
      'footer',
      'nav',
      '.global-header-container',
      '#navigationV2Container',
      '#standard-flyout-nav',
    ]);

    // Remove tracking pixels, iframes, noscript
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'img[src*="bat.bing.com"]',
      'img[src*="t.co/"]',
      'img[src*="analytics.twitter"]',
      'img[src*="rlcdn.com"]',
      'img[src*="id.rlcdn.com"]',
    ]);

    // Remove data-tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
