const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.post('/api/message',function(req, res){
    console.log(req.body);
    res.status(200);
});
const server = app.listen(5000, function(){
    console.log("listening on port: "+ server.address().port);
});
