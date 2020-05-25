// Requires
var express = require('express');
var mongoose = require('mongoose');

// Initialize variables
var app = express();

// Database connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    console.log('Database: \x1b[32m%s\x1b[0m', 'online');
});

// Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'Resquest successfully'
    })
})

// Listen request
app.listen(3000, () => {
    console.log('Express server running on port 3000: \x1b[32m%s\x1b[0m', 'online');
});