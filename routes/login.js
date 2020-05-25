var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');

app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err)
            return res.status(500).json({
                ok: false,
                msg: 'Error while search user',
                errors: err
            });

        if (!userDB)
            return res.status(400).json({
                ok: false,
                msg: 'Bad credentials - email',
                errors: err
            });

        if (!bcrypt.compareSync(body.password, userDB.password))
            return res.status(400).json({
                ok: false,
                msg: 'Bad credentials - password',
                errors: err
            });

        // Create token !!!
        userDB.password = ":)";
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });

    });
});

module.exports = app;