const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Users } = require('../models');
const Sequelize = require('sequelize');
// const { ensureAuthenticated } = require('../config/auth');

const User = require('../models/Users');


router.get('/login', async (req, res) => res.render('login'));
router.get('/register', async (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'All fields required' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        User.findOne({
            where: { email: email }
        })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email is already being used' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    console.log(newUser);

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            newUser.password = hash;

                            Users.create(newUser)
                            .then(user => {
                                req.flash('success_msg', 'You are now registered. Please log in.');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));              
                        }))
                }
            });
    }
});

module.exports = router;