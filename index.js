const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);




app.post('/menu', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || price == null) {
            return res.status(400).json({ error: 'Name and price are required' });
        }
        const newItem = new MenuItem({ name, description, price });
        await newItem.save();
        res.status(201).json({ message: 'Menu item added successfully', item: newItem });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
