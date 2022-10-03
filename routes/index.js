const express = require('express');
const router = express.Router();
const sequelize = require('../config/connection');
// const { ensureAuthenticated } = require('../config/auth');


router.get('/', (req, res) => res.render('welcome'));


module.exports = router;