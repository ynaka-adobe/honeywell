export default function init(el) {
  // Remove block name row
  const firstRow = el.children[0];
  if (firstRow) firstRow.remove();

  const tablist = document.createElement('div');
  tablist.className = 'tabs-industry-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...el.children];
  rows.forEach((row, i) => {
    const labelCell = row.firstElementChild;
    const id = labelCell.textContent.trim()
      .toLowerCase().replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    row.className = 'tabs-industry-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-industry-tab';
    button.id = `tab-${id}`;
    button.textContent = labelCell.textContent.trim();
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      el.querySelectorAll('[role=tabpanel]').forEach((p) => {
        p.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-selected', false);
      });
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    labelCell.remove();
  });

  el.prepend(tablist);
}
