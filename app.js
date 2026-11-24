// Тексты интерфейса на двух языках
const UI = {
  ua: { search: 'Пошук', gf: 'Без глютену', vegan: 'Веганське', stop: 'закінчилося', none: 'Нічого не знайдено', waiter: 'Покликати офіціанта', map: 'Як дістатися', cur: '₴' },
  en: { search: 'Search', gf: 'Gluten-free', vegan: 'Vegan', stop: 'sold out', none: 'Nothing found', waiter: 'Call the waiter', map: 'How to get here', cur: 'UAH' }
};

let data = null;
let lang = 'ua';

// 1. Загружаем меню из menu.json
fetch('menu.json')
  .then(r => r.json())
  .then(json => { data = json; render(); })
  .catch(() => {
    document.getElementById('menu').innerHTML = '<p class="empty">Не вдалося завантажити меню</p>';
  });

// 2. Рисуем меню с учётом языка, поиска и фильтров
function render() {
  const t = UI[lang];
  const q = document.getElementById('search').value.trim().toLowerCase();
  const gf = document.getElementById('f-gf').checked;
  const vegan = document.getElementById('f-vegan').checked;

  document.getElementById('search').placeholder = t.search;
  document.getElementById('t-gf').textContent = t.gf;
  document.getElementById('t-vegan').textContent = t.vegan;
  document.getElementById('btn-waiter').textContent = t.waiter;
  document.getElementById('btn-map').textContent = t.map;

  let tabs = '';
  let html = '';
  data.categories.forEach(cat => {
    const items = cat.items.filter(d =>
      d.name[lang].toLowerCase().includes(q) &&
      (!gf || d.glutenFree) && (!vegan || d.vegan));
    if (!items.length) return;
    tabs += `<a href="#${cat.id}">${cat.name[lang]}</a>`;
    html += `<h2 id="${cat.id}">${cat.name[lang]}</h2>`;
    items.forEach(d => {
      html += `<div class="dish ${d.stop ? 'stop' : ''}">
        <div class="row"><span>${d.name[lang]}</span><span>${d.price} ${t.cur}</span></div>
        <p>${d.description[lang]}</p>
        <small>${d.weight}</small>
        ${d.stop ? `<div class="badge">${t.stop}</div>` : ''}
      </div>`;
    });
  });
  document.getElementById('tabs').innerHTML = tabs;
  document.getElementById('menu').innerHTML = html || `<p class="empty">${t.none}</p>`;
}

// 3. Реакция на действия гостя
document.getElementById('search').addEventListener('input', render);
document.getElementById('f-gf').addEventListener('change', render);
document.getElementById('f-vegan').addEventListener('change', render);
['ua', 'en'].forEach(l => {
  document.getElementById('lang-' + l).addEventListener('click', () => {
    lang = l;
    document.getElementById('lang-ua').classList.toggle('active', l === 'ua');
    document.getElementById('lang-en').classList.toggle('active', l === 'en');
    document.documentElement.lang = l === 'ua' ? 'uk' : 'en';
    render();
  });
});
