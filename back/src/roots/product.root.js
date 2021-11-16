const express = require("express");
const controller = require("../controllers/product.controller");
const Auth = require("../middlewares/auth");

var token = new Auth();
var api = express.Router();

api.get("/products",token.ensureAuth, controller.list);
api.post("/product/register", token.ensureAuth, controller.register);
//api.get("/branch/search/:idBranch",token.ensureAuth, controller.search);
api.put("/product/edit/:idProduct",token.ensureAuth, controller.edit);
api.delete("/product/delete/:idProduct",token.ensureAuth, controller.remove);
//branch product
api.post("/product/add", token.ensureAuth, controller.add);
api.get("/product/tables", token.ensureAuth, controller.table);
api.put("/product/change", token.ensureAuth, controller.change);

module.exports = api;