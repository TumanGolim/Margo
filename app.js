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

  fetch("https://example.com/send-email", {
    // Замените example.com на ваш URL для отправки электронной почты
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
