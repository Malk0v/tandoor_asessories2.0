// var token = "6118003524:AAHjYaqFCkQEhg4QEwX4PBp6iGMR2q0uJjw";
//     var chatId = "-1001863675273";

// telegram.js — отправка заказа с именем и телефоном
(function () {
  const TOKEN = "6118003524:AAHjYaqFCkQEhg4QEwX4PBp6iGMR2q0uJjw"; // ← подставь свой токен
  const CHAT_ID = "-1001863675273"; // ← подставь свой chat_id
  const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  const sendBtn = document.getElementById("send-order");
  const nameInput = document.getElementById("customer-name");
  const phoneInput = document.getElementById("customer-phone");
  const postInput = document.getElementById("customer-post");
  const modal = document.getElementById("cart-modal");

  if (!sendBtn) return;

  sendBtn.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const post = postInput.value.trim();

    if (!cart.length) {
      alert("Корзина порожня!");
      return;
    }

    if (!name || !phone || !post) {
      alert("Будь ласка, введіть ім’я та телефон та віділення пошти.");
      return;
    }

    let message = `<b>🛍 Нове замовлення</b>\n\n`;
    message += `<b>👤 Ім’я:</b> ${name}\n`;
    message += `<b>📞 Телефон:</b> ${phone}\n\n`;
    message += `<b>📞 Відправляти:</b> ${post}\n\n`;
    message += `<b>Товари:</b>\n`;

    let total = 0;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.option}) — ₴${
        item.price
      }\n`;
      total += item.price;
    });

    message += `\n<b>💰 Всього:</b> ₴${total}`;

    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Замовлення успішно надіслано!");
        // очистка корзины
        localStorage.removeItem("cart");
        // cart = []; // глобальная переменная cart из cart.js
        window.cart = cart; // синхронизация

        localStorage.removeItem("cart");
        document.getElementById("cart-items").innerHTML = "";
        document.getElementById("cart-total").textContent = "";
        nameInput.value = "";
        phoneInput.value = "";
        document.getElementById("cart-count").textContent = "0";
      })
      .catch(() => alert("❌ Помилка при відправці замовлення."));
  });
})();
