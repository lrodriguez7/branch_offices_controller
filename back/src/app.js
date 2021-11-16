const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

var userRoots = require("../src/roots/user.root");
var companyRoots = require("../src/roots/company.root");
var branchRoots = require("../src/roots/branch.root");
var productRoots = require("../src/roots/product.root");


app.use("/api", userRoots, companyRoots, branchRoots, productRoots);

module.exports = app;