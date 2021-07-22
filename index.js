const express = require('express');
const app = express();
const path = require('path');
const brcypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const server = require('./config/db.js');
const generateToken = require('./utils/generateToken.js');
const { log } = require('console');
const { postSignup, postLogin, byeRestricted, getSignup, getLogin, getLogout, getHome } = require('./controllers/users.js');
require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/signup', getSignup);
app.post('/signup', postSignup);
app.get('/login', getLogin);
app.post('/login', postLogin);
app.get('/bye', byeRestricted);
app.get('/logout',getLogout);
app.get('/',getHome);
app.get('*',(req,res)=>{
    res.sendStatus(404);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server has started on port ${PORT}`);
});
