'use strict';

require('dotenv').config();
const PORT = process.env.PORT;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const messageModel = require('./src/schema/messageSchema.js');
const logger = require('./src/middleware/logger.js');
const app = express();
app.use(cors());
app.use(express.json());

// ==========Establishing Mongo DB Connection==========
// https://cloud.mongodb.com/v2/629e96601962f23e8dc4e009#clusters
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// Database connection confirmation
db.once('open', () => {
    console.log('Database connected!');
});

// ==========Routes==========
// Test route
app.get('/', logger, (req, res) => {
    res.send('Hello world!');
});

app.get('/messages', logger, async (req, res) => {
    let result = await messageModel.find({})
    res.json(result);
});

app.post('/test-pass', logger, (req, res) => {
    if (req.body.pass === process.env.ADMIN) {
        res.send(true);
    } else {
        res.send(false);
    }
});

// Deletes specific message
app.delete('/delete-this', logger, async (req, res) => {
    try {
        await messageModel.findByIdAndDelete(req.query.id);
        res.status(200).send('Successfully deleted!');
    } catch {
        res.status(500).send('Something went wrong...');
    }
});

// Post to create message
app.post('/create-message', logger, async (req, res) => {
    let result = await messageModel.create(req.body);
    res.status(200).send(result);
});

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ::: ${PORT}`)
});