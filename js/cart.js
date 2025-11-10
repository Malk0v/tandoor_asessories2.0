// cart.js
var cart = JSON.parse(localStorage.getItem("cart") || "[]");

function customAlert(message) {
  const alertBox = document.createElement("div");
  alertBox.className = "custom-alert";
  alertBox.textContent = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

function updateCartCount() {
  var el = document.getElementById("cart-count");
  if (el) el.textContent = cart.length;
}

function addToCart(id) {
  var product = (window.products || []).find(function (p) {
    return p.id === id;
  });
  if (!product) return customAlert("Товар не знайдено");
  //alert("Товар не знайдено");

  var select = document.getElementById("opt-" + id);
  var price = Number(select.value);
  var optionText = select.options[select.selectedIndex].text.split(" — ")[0];

  cart.push({
    id: product.id,
    name: product.name,
    option: optionText,
    price: price,
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  customAlert("Додано до корзини");

  //alert("Додано до корзини");
}

function renderCart() {
  var container = document.getElementById("cart-items");
  if (!container) return;
  container.innerHTML = "";
  var total = 0;
  cart.forEach(function (item, i) {
    var div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML =
      "<div>" +
      item.name +
      " (" +
      item.option +
      ")</div>" +
      "<div>₴" +
      item.price +
      ' <button onclick="removeFromCart(' +
      i +
      ')">✕</button></div>';
    container.appendChild(div);
    total += item.price;
  });
  var totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = "Всього: ₴" + total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  var cartBtn = document.getElementById("cart-btn");
  var closeBtn = document.getElementById("close-cart");
  var modal = document.getElementById("cart-modal");

  if (cartBtn)
    cartBtn.addEventListener("click", function () {
      modal.classList.remove("hidden");
      renderCart();
    });

  if (closeBtn)
    closeBtn.addEventListener("click", function () {
      modal.classList.add("hidden");
    });
});

(function () {
  const cartModal = document.getElementById("cart-modal");
  const cartBtn = document.getElementById("cart-btn");
  const closeBtn = document.getElementById("close-cart");

  function openCart() {
    cartModal.style.display = "flex";
    // Небольшая задержка, чтобы transition сработал корректно
    setTimeout(() => {
      cartModal.classList.add("active");
    }, 10);
  }

  function closeCart() {
    cartModal.classList.remove("active");
    cartModal.classList.add("hidden");
    setTimeout(() => {
      cartModal.style.display = "none";
    }, 300); // ждём завершения анимации
  }

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (closeBtn) closeBtn.addEventListener("click", closeCart);

  // Экспорт для telegram.js
  window.closeCartModal = closeCart;
})();
