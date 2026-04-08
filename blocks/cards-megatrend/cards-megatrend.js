export default function init(el) {
  // Remove block name row
  const firstRow = el.children[0];
  if (firstRow) firstRow.remove();

  const ul = document.createElement('ul');
  [...el.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture, img')) {
        div.className = 'cards-megatrend-card-image';
      } else {
        div.className = 'cards-megatrend-card-body';
      }
    });
    ul.append(li);
  });
  el.textContent = '';
  el.append(ul);
}
