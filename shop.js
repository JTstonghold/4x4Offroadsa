var WHATSAPP = '27618398991';
var cart = {};            // { productIndex: quantity }
var cat = 'All';
var queryParams = new URLSearchParams(window.location.search);
var requestedProduct = queryParams.get('product');
var requestedCategory = queryParams.get('category');

function $(id){ return document.getElementById(id); }
function money(n){ return 'R' + String(n).replace(/\B(?=(\d{3})+$)/g, ' '); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

// Cart saved in the browser (wrapped so it never breaks the page)
try { cart = JSON.parse(localStorage.getItem('cart4x4') || '{}'); } catch (e) { cart = {}; }
function save(){ try { localStorage.setItem('cart4x4', JSON.stringify(cart)); } catch (e) {} }

// Category chips
var cats = ['All'];
PRODUCTS.forEach(function(p){ if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
if (cats.indexOf(requestedCategory) >= 0) cat = requestedCategory;
cats.forEach(function(c){
  var b = document.createElement('button');
  b.className = 'chip' + (c === cat ? ' on' : '');
  b.textContent = c;
  b.onclick = function(){
    cat = c;
    [].forEach.call($('chips').children, function(x){ x.classList.toggle('on', x === b); });
    draw();
  };
  $('chips').appendChild(b);
});

function draw(){
  var q = $('q').value.toLowerCase(), sort = $('sort').value;
  var list = PRODUCTS.map(function(p, i){ return {p: p, i: i}; }).filter(function(o){
    return (cat === 'All' || o.p.cat === cat) &&
           (o.p.name + ' ' + o.p.brand + ' ' + o.p.cat).toLowerCase().indexOf(q) >= 0;
  });
  if (sort) list.sort(function(a, b){ return sort === 'lo' ? a.p.price - b.p.price : b.p.price - a.p.price; });
  $('count').textContent = list.length + ' product' + (list.length === 1 ? '' : 's');
  $('grid').innerHTML = list.map(function(o){
    var p = o.p;
    var pic = /\.(jpe?g|png|webp)$/i.test(p.image || '') ? '<img loading="lazy" src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' : p.icon;
    var productId = p.id ? ' id="product-' + esc(p.id) + '"' : '';
    var price = p.price
      ? '<div class="pr">' + money(p.price) + (p.was ? '<s>' + money(p.was) + '</s>' : '') + '</div>'
      : '<div class="pr" style="font-size:16px;color:var(--mute)">Price on request</div>';
    var btn = p.price
      ? '<button class="btn" onclick="add(' + o.i + ')">Add to cart</button>'
      : '<a class="btn alt" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('Hi, please quote me on: ' + p.name) + '">Request a quote</a>';
    return '<div class="p"' + productId + '><div class="pi">' + (p.badge ? '<span class="bd">' + p.badge + '</span>' : '') + pic +
           '</div><div class="pb"><small>' + p.cat + (p.brand ? ' · ' + esc(p.brand) : '') + '</small><h3>' + esc(p.name) + '</h3>' + price + btn + '</div></div>';
  }).join('') || '<div class="none">No products found. Try another search.</div>';
}

function add(i){ cart[i] = (cart[i] || 0) + 1; save(); renderCart(); toast('Added to cart'); }
function change(i, d){ cart[i] = (cart[i] || 0) + d; if (cart[i] <= 0) delete cart[i]; save(); renderCart(); }
function remove(i){ delete cart[i]; save(); renderCart(); }

function renderCart(){
  var ids = Object.keys(cart), total = 0, count = 0;
  $('items').innerHTML = ids.length ? ids.map(function(i){
    var p = PRODUCTS[i]; if (!p) return '';
    var q = cart[i]; total += p.price * q; count += q;
    return '<div class="it"><div class="ic">' + p.icon + '</div><div><b>' + esc(p.name) + '</b><span>' + money(p.price) + '</span>' +
           '<div class="qty"><button onclick="change(' + i + ',-1)">−</button><span>' + q + '</span><button onclick="change(' + i + ',1)">+</button></div></div>' +
           '<button class="rm" onclick="remove(' + i + ')">Remove</button></div>';
  }).join('') : '<div class="empty">Your cart is empty.</div>';
  $('subtotal').textContent = money(total);
  $('cartCount').textContent = count;
}

function openCart(on){ $('drawer').classList.toggle('on', on); $('overlay').classList.toggle('on', on); }
function toast(msg){ var t = $('toast'); t.textContent = msg; t.classList.add('on'); setTimeout(function(){ t.classList.remove('on'); }, 1600); }

$('cartBtn').onclick = function(){ openCart(true); };
$('closeCart').onclick = $('overlay').onclick = function(){ openCart(false); };
$('checkout').onclick = function(){
  // On the live Shopify store this button goes to Shopify's secure checkout.
  toast('Preview only: this goes to secure checkout on the live store');
};
$('q').oninput = draw;
$('sort').onchange = draw;
draw(); renderCart();
if (requestedProduct) {
  var requestedCard = $('product-' + requestedProduct);
  if (requestedCard) {
    requestedCard.scrollIntoView({behavior:'instant', block:'center'});
    requestedCard.classList.add('product-target');
    window.setTimeout(function(){ requestedCard.classList.remove('product-target'); }, 2600);
  }
} else if (cat !== 'All') {
  document.querySelector('.filters').scrollIntoView({behavior:'instant', block:'start'});
}
