const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/usersRoute");
const adminRoutes = require('./routes/adminRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')
const {approvedRestaurantMiddleware, adminMiddleware} = require("./middleware");
const pool = require("./db/db");
const session = require("express-session");
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT;


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET', 'OPTIONS'],  // replace with your Next.js URL
  credentials: true   // allow cookies/authorization headers if needed
}));

app.use(express.json());
pool.connect();


app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api/auth', userRoutes);
app.use('/api/admin', adminMiddleware, adminRoutes);
app.use('/api/restaurant', approvedRestaurantMiddleware, restaurantRoutes);

app.use(errorHandler);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
