const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = Schema({
    
    idPlace: String,
    nameUser: String,
    lastnameUser: String,
    nickUser: String,
    emailUser: String,
    passwordUser: String,

    rolUser: {type: String, default:"user", enum:["user","company","branch","admin"]}
});

module.exports = mongoose.model("users",userSchema);