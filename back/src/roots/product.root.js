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
api.get("/product/tables", token.ensureAuth, controller.tables);
api.post("/product/add", token.ensureAuth, controller.add);
api.post("/product/tables", token.ensureAuth, controller.table);
api.put("/product/change/:idProduct", token.ensureAuth, controller.change);
api.delete("/product/deleter/:idProduct", token.ensureAuth, controller.deleter);
//branch sales
api.put("/product/sale/:idProduct", token.ensureAuth, controller.sale);

module.exports = api;