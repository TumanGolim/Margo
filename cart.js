let cart = []; // Массив для хранения товаров в корзине

// Функция для добавления товара в корзину
function addToCart(name, price) {
  cart.push({ name, price });
  updateCartView();
}

// Функция для обновления отображения корзины
function updateCartView() {
  const cartList = document.getElementById("cart-items");
  const cartListModal = document.getElementById("cart-items-modal");

  if (!cartList || !cartListModal) {
    console.error(
      "Элемент с id 'cart-items' или 'cart-items-modal' не найден на странице."
    );
    return;
  }

  cartList.innerHTML = ""; // Очищаем список товаров
  cartListModal.innerHTML = ""; // Очищаем список товаров в модальном окне

  let totalPrice = 0;

  // Добавляем каждый товар в список
  cart.forEach((item) => {
    const listItem = document.createElement("li");
    const listItemModal = document.createElement("li");

    listItem.textContent = `${item.name} - ${item.price} грн.`;
    listItemModal.textContent = `${item.name} - ${item.price} грн.`;

    cartList.appendChild(listItem);
    cartListModal.appendChild(listItemModal);

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

// Добавляем функционал для открытия и закрытия модального окна при клике на кнопку "Заказать" и "Закрыть"
const orderBtn = document.getElementById("order-btn");
const orderModal = document.getElementById("order-modal");
const closeModalBtn = document.querySelector(".close-modal-btn");

orderBtn.addEventListener("click", function () {
  updateCartView(); // Обновляем отображение корзины в модальном окне
  orderModal.style.display = "block";
});

closeModalBtn.addEventListener("click", function () {
  orderModal.style.display = "none";
});

// Функция для отправки уведомления о заказе в Телеграм
function sendTelegramNotification(orderData) {
  const chatId = 750458682; // Ваш chat_id
  const token = "6619034502:AAHkuNvShiOvEUqW9ek7JrQbk1LPTEuDOWY"; // Токен вашего бота

  const message = `
 🛒 Новый заказ!\n
    👤 Имя: ${orderData.name}\n
    📞 Телефон: ${orderData.phone}\n
    📍 Город: ${orderData.city}\n
    🏤 Отделение: ${orderData.postOffice}\n
    💰 Итог: ${orderData.totalPrice}\n
    🛍 Товары:\n${orderData.cartItems}
    `;

  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("text", message);

  fetch(telegramUrl, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) =>
      console.error("Error sending Telegram notification:", error)
    );
}

// Добавляем функционал для отправки заказа на сервер
const orderForm = document.getElementById("order-form");

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const city = document.getElementById("city").value;
  const postOffice = document.getElementById("postOffice").value;
  const totalPrice = document.getElementById("total-price").textContent;
  const cartItems = cart
    .map((item) => `${item.name} - ${item.price} грн.`)
    .join("\n");

  const orderData = {
    name: name,
    surname: surname,
    phone: phone,
    email: email,
    city: city,
    postOffice: postOffice,
    totalPrice: totalPrice,
    cartItems: cartItems,
  };

  // Отправляем уведомление в Телеграм
  sendTelegramNotification(orderData);

  // После успешной отправки заказа очищаем корзину и закрываем модальное окно
  alert("Ваш заказ успешно размещен!");
  cart.length = 0; // Очищаем корзину
  updateCartView(); // Обновляем отображение корзины
  orderModal.style.display = "none"; // Закрываем модальное окно
});
