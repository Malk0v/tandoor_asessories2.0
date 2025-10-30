// app.js (synchronous) - renders products from window.productsData
(function() {
  // Ensure DOM is ready
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    var products = window.productsData || [];
    var container = document.getElementById('product-list');

    products.forEach(function(p) {
      var card = document.createElement('div');
      card.className = 'card';
      var optionsHtml = p.options.map(function(o, idx) {
        return '<option value="' + o.price + '">' + o.diameter + ' — ₴' + o.price + '</option>';
      }).join('');

      card.innerHTML = ''
        + '<img src="' + p.image + '" alt="' + p.name + '">'
        + '<h3>' + p.name + '</h3>'
        + '<p>' + p.description + '</p>'
        + '<select class="option-select" id="opt-' + p.id + '">' + optionsHtml + '</select>'
        + '<div><button class="btn" data-id="' + p.id + '">Додати</button></div>';

      container.appendChild(card);
    });

    // expose to other scripts
    window.products = products;

    // attach delegated click listener for add buttons
    container.addEventListener('click', function(e) {
      var btn = e.target.closest('button[data-id]');
      if (!btn) return;
      var id = parseInt(btn.getAttribute('data-id'), 10);
      if (typeof window.addToCart === 'function') {
        window.addToCart(id);
      } else {
        console.warn('addToCart not defined yet');
      }
    });
  });
})();