const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var branchSchema = Schema({
    
    nameBranch: String,
    addressBranch: String,
    idCompany: String,
    sale: Number,


    
});

module.exports = mongoose.model("branches",branchSchema);