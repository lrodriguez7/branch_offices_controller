const express = require("express");
const controller = require("../controllers/company.controller");
const Auth = require("../middlewares/auth");

var token = new Auth();
var api = express.Router();

api.get("/companies",token.ensureAuth, controller.list);
api.post("/company/register", token.ensureAuth, controller.register);
api.get("/company/search/:idCompany",token.ensureAuth, controller.search);
api.put("/company/edit/:idCompany",token.ensureAuth, controller.edit);
api.delete("/company/delete/:idCompany",token.ensureAuth, controller.remove);

module.exports = api;