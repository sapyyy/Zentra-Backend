const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

// importing routes
const authRouter = require("./routes/auth.route");
const destinationRouter = require("./routes/destination.route");
const packageRouter = require("./routes/package.route");

// storing the .env info inside variables
const PORT = process.env.PORT;
const URI = process.env.URI;

// connecting to the database
connectDB(URI);

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRouter);
app.use("/api/destinations/", destinationRouter);
app.use("/api/packages/", packageRouter);

app.listen(PORT, () => {
  console.log(`Server is running fine on the port number ${PORT}`);
});

// defualt route
app.use((req, res) => {
  res.status(404).json({
    status: "Bad request : No such route",
  });
});
