const express = require("express");
const cors = require("cors");

const app = express();

// cors
app.use(
  cors({
    origin: ["http://localhost:5173", "https://habytix.vercel.app"], // frontend URL
    credentials: true,               // allow cookies / auth headers
  })
);

// middlewares
app.use(express.json());

// routes
app.use("/api/tickets", require("./routes/ticket.routes"));
app.use("/api/users", require("./routes/user.routes"));

module.exports = app;
