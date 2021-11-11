const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var companySchema = Schema({
    
    nameCompany: String,
    sale: Number,
    
});

module.exports = mongoose.model("companies",companySchema);