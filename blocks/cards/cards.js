import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { createTag } from '../../scripts/scripts.js';

export default function decorate(block) {
  if (block.className.includes('data')) {
    dataDrivenCards(block)
    return;
  }
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}

async function dataDrivenCards(block) {
  const pimURL = new URL(block.querySelector('a').href);
  const resp = await fetch(pimURL);
  const json = await resp.json();
  const ul = createTag('ul');
  console.log(json.data)
  json.data.forEach((row) => {
    const li = createTag('li');
    const divImage = createTag('div', {class: 'cards-card-image'});
    divImage.appendChild(createOptimizedPicture(`/products/images/${row.Image}`));
    const divDesc = createTag('div', {class: 'cards-card-body'});
    divDesc.innerHTML = `<p>${row.Desc.split('|').join('</p><p>')}</p>`;
    li.appendChild(divImage);
    li.appendChild(divDesc);
    ul.appendChild(li);
    console.log(row);
  });
  console.log(ul);
  [...block.children][0].replaceWith(ul);
}