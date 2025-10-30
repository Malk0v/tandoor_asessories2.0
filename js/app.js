// app.js - synchronous renderer + filter (uses window.productsData)
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var products = window.productsData || [];
    var container = document.getElementById("product-list");
    var categorySelect = document.getElementById("category-select");
    var searchInput = document.getElementById("search-input");

    // expose products globally
    window.products = products;

    // build category options (unique)
    var categories = products.reduce(function (acc, p) {
      if (p.category && acc.indexOf(p.category) === -1) acc.push(p.category);
      return acc;
    }, []);
    categories.sort();

    categories.forEach(function (cat) {
      var opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });

    // render function (accepts filtered array)
    function render(list) {
      container.innerHTML = "";
      if (!list.length) {
        container.innerHTML =
          '<p style="padding:2rem;color:#666">Товари не знайдені.</p>';
        return;
      }
      list.forEach(function (p) {
        var card = document.createElement("div");
        card.className = "card";

        var optionsHtml = p.options
          .map(function (o) {
            return (
              '<option value="' +
              o.price +
              '">' +
              o.diameter +
              " — ₴" +
              o.price +
              "</option>"
            );
          })
          .join("");

        card.innerHTML =
          "" +
          '<img src="' +
          p.image +
          '" alt="' +
          p.name +
          '">' +
          "<h3>" +
          p.name +
          "</h3>" +
          "<p>" +
          p.description +
          "</p>" +
          '<select class="option-select" id="opt-' +
          p.id +
          '">' +
          optionsHtml +
          "</select>" +
          '<div style="margin-top:0.6rem;"><button class="btn" data-id="' +
          p.id +
          '">Додати</button></div>';

        container.appendChild(card);
      });
    }

    // initial render (all)
    render(products);

    // filtering logic
    function applyFilters() {
      var q = (searchInput.value || "").trim().toLowerCase();
      var cat = categorySelect.value;

      var filtered = products.filter(function (p) {
        var matchCat = cat === "all" || p.category === cat;
        var inText =
          !q ||
          (p.name && p.name.toLowerCase().indexOf(q) !== -1) ||
          (p.description && p.description.toLowerCase().indexOf(q) !== -1);
        return matchCat && inText;
      });

      render(filtered);
    }

    // events
    categorySelect.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);

    // delegate add-to-cart clicks to container (cart.js defines addToCart)
    container.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-id]");
      if (!btn) return;
      var id = parseInt(btn.getAttribute("data-id"), 10);
      if (typeof window.addToCart === "function") {
        window.addToCart(id);
      } else {
        // fallback - try calling global function name
        if (window.addToCart) window.addToCart(id);
      }
    });
  });
})();
