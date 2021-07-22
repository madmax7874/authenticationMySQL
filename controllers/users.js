const express = require('express');
const app = express();
const path = require('path');
const brcypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const generateToken = require('../utils/generateToken.js');
const server = require('../config/db.js')
const mysql = require("mysql")

const postSignup = async (req,res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        const passwordHash =await brcypt.hash(password,10);
        let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
        let query = mysql.format(insertQuery,["user","firstName","lastName","email","password",firstName, lastName, email, passwordHash]);
        server.query(query, (err, response)=>{
            if(response){
                let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';    
                let queryselect = mysql.format(selectQuery,["user","email", email]);
                server.query(queryselect, (err, data) => {
                    const parsed = JSON.parse(JSON.stringify(data))
                    const token = generateToken(parsed[0].email)
                    res.cookie('nToken',token,{maxAge:36000000,httpOnly:true});
                    res.redirect('/bye');
                })
            }else{
                const error = "Email already in use. Try entering another one!";
                res.render('error',{error});
            }   
        })   
    } catch (e) {
        const error = "Email already in use. Try entering another one!";
        res.render('error',{error});
    }
}

const postLogin =async (req,res)=>{
    try {
        const {email, password} = req.body;
        let loginQuery = 'SELECT * FROM ?? WHERE ?? = ?';    
        let queryLogin = mysql.format(loginQuery,["user","email", email]);
        server.query(queryLogin,async (err,data)=>{
            const parsedData = JSON.parse(JSON.stringify(data))[0]
            console.log(parsedData)
            if(parsedData){
                const comparePassword =await brcypt.compare(password,parsedData.password);
                if(comparePassword){
                    const token = generateToken(parsedData.email)
                    res.cookie('nToken',token,{maxAge:36000000,httpOnly:true})
                    res.redirect('/bye');
                }
                else{
                    const error = "Password incorrect";
                    res.render('error',{error});
                }
            }else {
                const error = "Invalid email";
                res.render('error',{error});
            }
        })
    }catch (e) {
        const error = "Invalid email";
        res.render('error',{error});
    }  
}

const byeRestricted = async (req, res) => {  
    try {
        const decoded = jwt.verify(req.cookies.nToken, process.env.JWTKEY);
        let checkTokenQuery = 'SELECT * FROM ?? WHERE ?? = ?';    
        let queryCheckToken = mysql.format(checkTokenQuery,["user","email", decoded.id]);
        server.query(queryCheckToken, (err, data) => {
            const parsedData = JSON.parse(JSON.stringify(data))[0]
            console.log(parsedData)
            res.render('bye',{parsedData});
        })
    } catch (e) {
        const error = "Please Login first";
        res.render('error',{error});
    }
}

const getSignup = async(req,res)=>{
    try {
        res.render('signup');
    } catch (error) {
        res.sendStatus(403);
    }
}

const getLogin = async (req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        res.sendStatus(403);
    }
}

const getLogout = async (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
}

const getHome = async (req,res)=>{
    try {
        res.render('home');
    } catch (error) {
        res.sendStatus(403);
    }
}

module.exports = {postSignup, postLogin, byeRestricted, getSignup, getLogin, getLogout, getHome};