// cart.js
var cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount() {
  var el = document.getElementById('cart-count');
  if (el) el.textContent = cart.length;
}

function addToCart(id) {
  var product = (window.products || []).find(function(p){ return p.id === id; });
  if (!product) return alert('Товар не знайдено');

  var select = document.getElementById('opt-' + id);
  var price = Number(select.value);
  var optionText = select.options[select.selectedIndex].text.split(' — ')[0];

  cart.push({
    id: product.id,
    name: product.name,
    option: optionText,
    price: price
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Додано до корзини');
}

function renderCart() {
  var container = document.getElementById('cart-items');
  if (!container) return;
  container.innerHTML = '';
  var total = 0;
  cart.forEach(function(item, i){
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = '<div>' + item.name + ' (' + item.option + ')</div>'
                  + '<div>₴' + item.price + ' <button onclick="removeFromCart(' + i + ')">✕</button></div>';
    container.appendChild(div);
    total += item.price;
  });
  var totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = 'Всього: ₴' + total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

document.addEventListener('DOMContentLoaded', function(){
  updateCartCount();

  var cartBtn = document.getElementById('cart-btn');
  var closeBtn = document.getElementById('close-cart');
  var modal = document.getElementById('cart-modal');

  if (cartBtn) cartBtn.addEventListener('click', function(){
    modal.classList.remove('hidden');
    renderCart();
  });

  if (closeBtn) closeBtn.addEventListener('click', function(){
    modal.classList.add('hidden');
  });
});
