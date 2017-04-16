const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Message = require("./models/message");
const User = require("./models/user");
const jwt = require("jwt-simple");
const moment = require("moment");
const cors = require('./services/cors.js');
const checkAuthenticated = require('./services/checkAuthentication.js');
const app = express();

mongoose.connect("mongodb://localhost/messagePosts");
mongoose.connection.once('open', function () {
    console.log('connection has been made successfully');
}).on('error', function (error) {
    console.log("connection error:" + error);
});
mongoose.Promise = global.Promise;

function createToken(user){
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, 'secret');
}



app.use(bodyParser.json());
app.use(cors);

app.get('/api/message', function (req, res) {
    Message.find({}).populate('user', '-pwd').then(function (messages) {
        res.send(messages);
    }).catch(function(messages){
        res.status(500).send({error: messages.error});
    });
});

app.post('/api/message', checkAuthenticated, function (req, res) {
    console.log(req.body, req.user);
    req.body.user =req.user;
    Message.create(req.body).then(function (messages) {
        res.send(messages);
    });
});

app.post('/auth/register', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if(user){
            return res.status(409).send({message: 'Email is already registered!'});
        }
        User.create(req.body).then(function (result) {
            res.status(200).send({token: createToken(result)})
        }).catch(function (result) {
            console.log(result);
            res.status(500).send(result);
        });
    });
});

app.post('/auth/login', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if(!user){
            return res.status(401).send({message: 'Email or password is invalid'});
        }
        if(req.body.pwd == user.pwd){
            res.send({token: createToken(user)})
        }
        else{
           return res.status(401).send({message: 'Invalid email and/or password.'});
        }
    });
});



const server = app.listen(5000, function () {
    console.log("listening on port: " + server.address().port);
});
