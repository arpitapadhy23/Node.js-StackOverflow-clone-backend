const path = require("path"); 
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const app = express();

const userRoutes = require("./users/routes");
const { search } = require("../src/users/controllers");
const questionRoutes = require("./question/routes");
const { globalErrorHandler } = require("./utils/globalErrorHandler");

const PORT = process.env.PORT || 3000;

app.use(express.json());

//ROUTES
app.post("/search", search);
app.use("/user", userRoutes);
app.use("/question", questionRoutes);

app.get("/", (req, res, next) => {
  res.send("Welcome to Stack Overflow Clone");
});

app.use(globalErrorHandler);

app.listen(PORT);
