const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/usersRoute");
const errorHandler = require("./middleware/errorHandler");
const pool = require("./db/db");
const session = require("express-session");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
pool.connect();


app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", userRoutes);
app.use(errorHandler);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
