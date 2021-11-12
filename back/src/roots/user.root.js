const express = require("express");
const controller = require("../controllers/user.controller");
const Auth = require("../middlewares/auth");

var token = new Auth();
var api = express.Router();

api.get("/users",token.ensureAuth, controller.list);
api.post("/user/register", token.ensureAuthOptional, controller.register);
api.post("/user/login", controller.login);
api.get("/user/search/:idUser",token.ensureAuth, controller.search);
api.put("/user/edit/:idUser",token.ensureAuth, controller.edit);
api.delete("/user/delete/:idUser",token.ensureAuth, controller.remove);

module.exports = api;