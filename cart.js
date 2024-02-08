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

  // Отправляем данные на Google Sheets
  // URL вашего Google Apps Script
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbxKGpwx2EQ7DhmNvSkkpN--4FnqoF5fyZoQouV3epKidiiji2gd_EtrK3OfrZO5cckV/exec";

  // Функция для отправки данных на сервер
  function sendOrderToGoogleAppsScript(data) {
    // Создаем объект FormData для отправки данных формы
    const form = new FormData();
    form.append("name", data.name);
    form.append("surname", data.surname);
    form.append("phone", data.phone);
    form.append("email", data.email);
    form.append("city", data.city);
    form.append("postOffice", data.postOffice);
    form.append("totalPrice", data.totalPrice);
    form.append("cartItems", data.cartItems);

    // Отправляем данные на Google Apps Script
    fetch(scriptURL, { method: "POST", body: form, mode: "cors" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Действия при успешной отправке данных
        console.log("Success:", data);
        alert("Ваш заказ успешно размещен!");
      })
      .catch((error) => {
        // Обработка ошибок
        console.error("Error:", error);
        alert("Произошла ошибка при отправке заказа.");
      });
  }

  // Обработчик события отправки формы заказа
  const orderForm = document.getElementById("order-form");

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Получаем данные формы
    const formData = {
      name: document.getElementById("name").value,
      surname: document.getElementById("surname").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      city: document.getElementById("city").value,
      postOffice: document.getElementById("postOffice").value,
      totalPrice: document.getElementById("total-price").textContent,
      cartItems: cart
        .map((item) => `${item.name} - ${item.price} грн.`)
        .join("\n"),
    };

    // Отправляем данные на сервер
    sendOrderToGoogleAppsScript(formData);
  });
  m.append("cartItems", cartItems);

  fetch(scriptURL, { method: "POST", body: form })
    .then((response) => console.log("Success!", response))
    .catch((error) => console.error("Error!", error));

  // После успешной отправки заказа очищаем корзину и закрываем модальное окно
  alert("Ваш заказ успешно размещен!");
  cart = []; // Очищаем корзину
  updateCartView(); // Обновляем отображение корзины
  orderModal.style.display = "none"; // Закрываем модальное окно
});
