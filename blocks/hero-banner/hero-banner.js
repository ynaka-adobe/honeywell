export default function init(el) {
  const hasImage = el.querySelector('img');
  if (!hasImage) {
    el.classList.add('no-image');
  }
}
