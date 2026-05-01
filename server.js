const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// importing routes
const authRouter = require("./routes/auth.route");
const destinationRouter = require("./routes/destination.route");
const packageRouter = require("./routes/package.route");
const hotelRouter = require("./routes/hotel.route");
const transportRouter = require("./routes/transport.route");
const bookingRouter = require("./routes/booking.route");
const aiRouter = require("./routes/ai.route");
const reviewRouter = require("./routes/review.route");
const notificationRouter = require("./routes/notification.route");
const dashboardRouter = require("./routes/dashboard.route");
const userRouter = require("./routes/user.route");

// storing the .env info inside variables
const PORT = process.env.PORT;
const URI = process.env.URI;

// connecting to the database
connectDB(URI);

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth/", authRouter);
app.use("/api/destinations/", destinationRouter);
app.use("/api/packages/", packageRouter);
app.use("/api/hotels/", hotelRouter);
app.use("/api/transports/", transportRouter);
app.use("/api/bookings/", bookingRouter);
app.use("/api/ai/", aiRouter);
app.use("/api/reviews/", reviewRouter);
app.use("/api/notifications/", notificationRouter);
app.use("/api/dashboard/", dashboardRouter);
app.use("/api/users/", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running fine on the port number ${PORT}`);
});

// defualt route
app.use((req, res) => {
  res.status(404).json({
    status: "Bad request : No such route",
  });
});
