// telegram.js
document.addEventListener('DOMContentLoaded', function() {
  var sendBtn = document.getElementById('send-order');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', function() {
    if (!window.cart) {
      // sync with localStorage
    }
    var cartLocal = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cartLocal.length) return alert('Корзина порожня');

    var token = 'YOUR_BOT_TOKEN';
    var chatId = 'YOUR_CHAT_ID';

    var text = cartLocal.map(function(i){ return i.name + ' (' + i.option + ') — ₴' + i.price; }).join('\n');
    var total = cartLocal.reduce(function(s,i){ return s + i.price; }, 0);
    var message = '🛒 Нове замовлення:\n\n' + text + '\n\n💰 Всього: ₴' + total;

    // send message (fetch still used; requires network)
    fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    }).then(function(res){
      if (!res.ok) throw new Error('Network response was not ok');
      alert('Замовлення відправлено!');
      // clear cart
      localStorage.removeItem('cart');
      cart = [];
      updateCartCount();
      var modal = document.getElementById('cart-modal');
      if (modal) modal.classList.add('hidden');
    }).catch(function(err){
      console.error(err);
      alert('Помилка відправки. Перевірте токен/chat_id або підключення.');
    });
  });
});