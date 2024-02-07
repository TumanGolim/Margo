const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/submit-form", async (req, res) => {
  try {
    const formData = {
      "entry.1234567890": req.body.name,
      "entry.0987654321": req.body.surname,
      "entry.1357902468": req.body.phone,
      "entry.2468013579": req.body.email,
      "entry.8642075319": req.body.city,
      "entry.9753186420": req.body.postOffice,
      "entry.0123456789": req.body.totalPrice,
      "entry.9876543210": req.body.cartItems,
    };

    await axios.post(
      "https://docs.google.com/forms/d/e/1FAIpQLSdbJxbCro6F4gKbhWYhJJEpSZM2ISZivQbU1l5PDyusEzm1JA/formResponse",
      formData
    );
    res.status(200).send("Success");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
