const quoteForm = document.getElementById('f');

quoteForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const message = 'Hi 4x4 Offroad SA, I would like a quote.\nName: ' + document.getElementById('n').value +
    '\nVehicle: ' + document.getElementById('v').value +
    '\nLooking for: ' + document.getElementById('c').value +
    '\n' + document.getElementById('m').value;
  window.open('https://wa.me/27618398991?text=' + encodeURIComponent(message), '_blank');
});

const allVehicles = 'ALL';
const categories = ['All'].concat(PRODUCTS.map(function (product) {
  return product.category;
}).filter(function (category, index, values) {
  return values.indexOf(category) === index;
}));
let currentCategory = 'All';
const chips = document.getElementById('chips');
const productGrid = document.getElementById('pg');
const searchInput = document.getElementById('q');
const vehicleSelect = document.getElementById('veh');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character];
  });
}

function formatPrice(price) {
  return 'R' + String(price).replace(/\B(?=(\d{3})+$)/g, ' ');
}

categories.forEach(function (category) {
  const button = document.createElement('button');
  button.className = 'chip' + (category === 'All' ? ' on' : '');
  button.textContent = category;
  button.addEventListener('click', function () {
    currentCategory = category;
    Array.prototype.forEach.call(chips.children, function (chip) {
      chip.classList.toggle('on', chip === button);
    });
    drawProducts();
  });
  chips.appendChild(button);
});

function drawProducts() {
  const query = searchInput.value.toLowerCase();
  const vehicle = vehicleSelect.value;
  let count = 0;
  const visibleProducts = PRODUCTS.filter(function (product) {
    if (currentCategory !== 'All' && product.category !== currentCategory) return false;
    if (vehicle && product.vehicle.indexOf(vehicle) < 0 && product.vehicle.indexOf(allVehicles) < 0) return false;
    const searchable = [product.name, product.category, product.brand, product.description].join(' ').toLowerCase();
    return !query || searchable.indexOf(query) >= 0;
  });

  count = visibleProducts.length;
  productGrid.innerHTML = visibleProducts.map(function (product) {
    const imageIsFile = /\.(?:jpe?g|png|webp)$/i.test(product.image);
    const imageMarkup = imageIsFile
      ? '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy">'
      : escapeHtml(product.image);
    const badgeMarkup = product.badge ? '<span class="bd">' + escapeHtml(product.badge) + '</span>' : '';
    const brandMarkup = product.brand ? ' · ' + escapeHtml(product.brand) : '';
    const priceMarkup = product.price
      ? formatPrice(product.price)
      : '<span>Price on request</span>';
    const message = encodeURIComponent('Hi 4x4 Offroad SA, I am interested in: ' + product.name +
      (vehicle ? ' for my ' + vehicle : '') + '. Please send price and availability.');

    return '<div class="p"><div class="pi">' + badgeMarkup + imageMarkup + '</div>' +
      '<div class="pb"><small>' + escapeHtml(product.category) + brandMarkup + '</small>' +
      '<h3>' + escapeHtml(product.name) + '</h3><p>' + escapeHtml(product.description) + '</p>' +
      '<div class="pr">' + priceMarkup + '</div>' +
      '<a class="btn" target="_blank" href="https://wa.me/27618398991?text=' + message + '">Enquire</a></div></div>';
  }).join('') || '<div class="none">No matches yet. Message us and we will source it for you.</div>';

  document.getElementById('count').textContent = count + ' product' + (count === 1 ? '' : 's');
}

searchInput.addEventListener('input', drawProducts);
vehicleSelect.addEventListener('change', drawProducts);
drawProducts();
