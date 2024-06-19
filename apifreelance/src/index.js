const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
const ip = "10.0.0.109";

app.use(express.json());

// const Racao = mongoose.model("Racao", {
//     quantidadeRacao: Number,
//     tempoemMS: Number,
//     giroServo:     

// })



app.listen(port, ip, () => {
  mongoose.connect(
    "mongodb+srv://murilozapiello:Poikll01@freelanceeder.z4nzowk.mongodb.net/"
  );

  console.log(`App runing on http://${ip}:${port}`);
});
