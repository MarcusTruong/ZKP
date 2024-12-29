const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/ZKP")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("LogInCollection", logInSchema);

module.exports = collection;
