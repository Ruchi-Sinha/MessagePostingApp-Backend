const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    msg: String,
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    }
});

var Message = mongoose.model("messages", messageSchema);
module.exports = Message;
