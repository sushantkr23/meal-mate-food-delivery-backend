const express = require('express');
const cors = require('cors');
const mongoDB = require('./db');

const app = express();
const port = 5000;

// Connect MongoDB
mongoDB();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000',
          "https://meal-mate-food-delivery-frontend.onrender.com"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Routes
app.use('/api', require("./Routes/CreatUser"));
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));

// Test Route
app.get('/', (req, res) => {
  res.send('Hello World! -------');
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
});
