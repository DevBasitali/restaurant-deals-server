const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/usersRoute");
const adminRoutes = require('./routes/adminRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')
const {approvedRestaurantMiddleware, adminMiddleware} = require("./middleware/authMiddleware");
const pool = require("./db/db");
const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));


app.use(express.json());
pool.connect();

app.use(cookieParser());

app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/restaurant', approvedRestaurantMiddleware, restaurantRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
