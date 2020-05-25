var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var mdAutentication = require('../middlewares/autentication');

var app = express();

var User = require('../models/user');

app.get('/', (req, res, next) => {

    User.find({}, 'name email img role').exec(
        (err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error while loaded all users',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                users: users
            })

        });

});

app.post('/', mdAutentication.verifyToken, (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error while saved the user',
                errors: err
            })
        }

        res.status(201)
            .json({
                ok: true,
                body: userSaved,
                usertToken: req.user
            })
    });

});

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error while search the user.',
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Not exist any user with this id: ' + id,
                errors: { message: 'Not exist any user with this ID' }
            });
        }

        userDB.name = body.name;
        userDB.email = body.email;
        userDB.role = body.role;

        userDB.save((err, userSaved) => {

            if (err)
                return res.status(400).json({
                    ok: false,
                    msg: 'Error while saved the user',
                    errors: err
                });

            userSaved.password = ':)';

            res.status(200).json({
                ok: true,
                user: userSaved,
                msg: 'The user was updated successfully'
            });

        });

    });

});

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    User.findByIdAndDelete(id, (err, userDeleted) => {
        if (err)
            return res.status(500).json({
                ok: false,
                msg: 'Error while deleted the user',
                errors: err
            });

        if (!userDeleted)
            return res.status(400).json({
                ok: false,
                msg: 'Not exist user with this id',
                errors: err
            });

        res.status(200).json({
            ok: true,
            user: userDeleted,
            msg: 'The user was deleted successfully'
        });
    });
});

module.exports = app;