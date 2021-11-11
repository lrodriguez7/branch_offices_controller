const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var productSchema = Schema({
    
    nameProduct: String,
    nameProvedor: String,
    stock: Number,
    sale: Number,
    destiny: String,


    
});

module.exports = mongoose.model("products",productSchema);