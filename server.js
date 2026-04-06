const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");

// storing the .env info inside variables
const PORT = process.env.PORT;
const URI = process.env.URI;

// connecting to the database
connectDB(URI);

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running fine on the port number ${PORT}`);
});

// defualt route
app.use((req, res) => {
  res.status(404).json({
    status: "Bad request : No such route",
  });
});
