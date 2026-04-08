export default function init(el) {
  // Remove block name row
  const firstRow = el.children[0];
  if (firstRow) firstRow.remove();

  const rows = [...el.children];
  const headersRow = document.createElement('div');
  headersRow.className = 'tabs-platform-headers';

  let imagePanel = null;

  rows.forEach((row) => {
    const labelCell = row.firstElementChild;
    const contentCell = row.lastElementChild;
    const label = labelCell.textContent.trim();

    // Special _image row — becomes the large image panel
    if (label === '_image') {
      imagePanel = document.createElement('div');
      imagePanel.className = 'tabs-platform-image-panel';
      if (contentCell) {
        const img = contentCell.querySelector('img');
        if (img) imagePanel.append(img);

        const box = document.createElement('div');
        box.className = 'tabs-platform-content-box';
        const textEls = contentCell.querySelectorAll('h5, p');
        textEls.forEach((t) => box.append(t));
        if (box.children.length) imagePanel.append(box);
      }
      row.remove();
      return;
    }

    // Accordion item
    const item = document.createElement('div');
    item.className = 'tabs-platform-item';

    const header = document.createElement('button');
    header.className = 'tabs-platform-header';
    header.setAttribute('type', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.innerHTML = '<span class="tabs-platform-label">'
      + `${label}</span>`
      + '<span class="tabs-platform-icon"></span>';

    const desc = document.createElement('div');
    desc.className = 'tabs-platform-desc';
    desc.setAttribute('aria-hidden', 'true');
    if (contentCell && contentCell !== labelCell) {
      desc.innerHTML = contentCell.innerHTML;
    }

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // Toggle this item
      if (isOpen) {
        item.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
        desc.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        desc.setAttribute('aria-hidden', 'false');
      }
    });

    item.append(header);
    item.append(desc);
    headersRow.append(item);
    row.remove();
  });

  el.append(headersRow);
  if (imagePanel) el.append(imagePanel);
}
