const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const sequelize = require('./config/connection');

const app = express();

app.use(express.static('public'));

app.use(expresslayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
app.listen(PORT, console.log(`Server started on port ${PORT}`));
});
