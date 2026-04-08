export default function init(el) {
  // Remove block name row
  const firstRow = el.children[0];
  if (firstRow) firstRow.remove();

  const cols = [...el.firstElementChild.children];
  el.classList.add(`columns-contact-${cols.length}-cols`);

  [...el.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture, img');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-contact-img-col');
        }
      }
    });
  });
}
