const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var productSchema = Schema({
    
    idCompany: String,
    nameProduct: String,
    nameProvedor: String,
    stock: Number,
    sale: Number,
    idDestiny: String,


    
});

module.exports = mongoose.model("products",productSchema);