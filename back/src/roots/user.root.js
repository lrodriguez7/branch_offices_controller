const express = require("express");
const controller = require("../controllers/user.controller");
const Auth = require("../middlewares/auth");

var token = new Auth();
var api = express.Router();

api.get("/users",token.ensureAuth, controller.list);
api.post("/user/register", token.ensureAuth, controller.register);
api.post("/user/login", controller.login);
api.get("/user/search/:_id",token.ensureAuth, controller.search);
api.put("/user/edit/:_id",token.ensureAuth, controller.edit);
api.delete("/user/delete/:_id",token.ensureAuth, controller.remove);

api.get("/company/users",token.ensureAuth, controller.listCompany);

module.exports = api;