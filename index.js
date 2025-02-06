const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define MenuItem Schema
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: [0.01, 'Price must be greater than 0'] 
    }});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// POST /menu - Create a new menu item
app.post('/menu', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const newItem = new MenuItem({ name, description, price });
        await newItem.save();
        res.status(201).json({ message: 'Menu item created', item: newItem });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// GET /menu - Fetch all menu items
app.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});


const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});