const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./models/db'); // Correct path to db.js


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Test API Route
app.get('/', (req, res) => {
    res.send('BudgetBliss API is Running...');
});

// Import Routes
const expenseRoutes = require('./routes/expenses');
app.use('/expenses', expenseRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
