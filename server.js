const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(cors());
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

