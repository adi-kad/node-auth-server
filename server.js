const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
	useUnifiedTopology: true
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.send("Hello");
})

