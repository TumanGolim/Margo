let cart = []; // Массив для хранения товаров в корзине

// Функция для добавления товара в корзину
function addToCart(name, price) {
  cart.push({ name, price });
  updateCartView();
}

// Функция для обновления отображения корзины
function updateCartView() {
  const cartList = document.getElementById("cart-items");
  if (!cartList) {
    console.error("Элемент с id 'cart-items' не найден на странице.");
    return;
  }

  cartList.innerHTML = ""; // Очищаем список товаров

  let totalPrice = 0;

  // Добавляем каждый товар в список
  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} - ${item.price} грн.`;
    cartList.appendChild(listItem);
    totalPrice += item.price;
  });

  // Обновляем общую стоимость
  document.getElementById("total-price").textContent = totalPrice + " грн.";
}

// Находим все кнопки "Добавить в корзину" и добавляем обработчики событий
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", handleAddToCartClick);
});

// Функция для обработки добавления товара при клике на кнопку
function handleAddToCartClick(event) {
  const button = event.target;
  const name = button.dataset.name;
  const price = parseFloat(button.dataset.price);
  addToCart(name, price);
}

// Вызываем обновление отображения корзины при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  updateCartView();
});

// Добавляем функционал для показа и скрытия содержимого корзины при клике на кнопку корзины
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartContent = document.getElementById("cart-content");

cartToggleBtn.addEventListener("click", function () {
  cartContent.classList.toggle("active");
});

// Добавляем функционал для закрытия корзины при клике на кнопку "Закрыть"
const closeCartBtn = document.querySelector(".close-cart-btn");

closeCartBtn.addEventListener("click", function () {
  cartContent.classList.remove("active");
});

// Добавляем функционал для открытия модального окна при клике на кнопку "Заказать"
const orderBtn = document.getElementById("order-btn");
const orderModal = document.getElementById("order-modal");
const closeModalBtn = document.querySelector(".close-modal-btn");

orderBtn.addEventListener("click", function () {
  orderModal.style.display = "block";
});

closeModalBtn.addEventListener("click", function () {
  orderModal.style.display = "none";
});

// Добавляем функционал для отправки заказа на сервер
const orderForm = document.getElementById("order-form");

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const phone = document.getElementById("phone").value;
  const totalPrice = document.getElementById("total-price").textContent;
  const cartItems = cart
    .map((item) => `${item.name} - ${item.price} грн.`)
    .join("\n");

  const orderData = {
    name: name,
    surname: surname,
    phone: phone,
    totalPrice: totalPrice,
    cartItems: cartItems,
  };

  fetch("http://example.com/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => {
      if (response.ok) {
        alert("Ваш заказ успешно размещен!");
        cart = []; // Очищаем корзину
        updateCartView(); // Обновляем отображение корзины
        orderModal.style.display = "none"; // Закрываем модальное окно
      } else {
        throw new Error(
          "Ошибка отправки заказа. Пожалуйста, попробуйте позже."
        );
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      alert("Ошибка отправки заказа. Пожалуйста, попробуйте позже.");
    });
});
