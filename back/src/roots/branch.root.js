const express = require("express");
const controller = require("../controllers/branch.controller");
const Auth = require("../middlewares/auth");

var token = new Auth();
var api = express.Router();

api.get("/branches",token.ensureAuth, controller.list);
api.post("/branch/register", token.ensureAuth, controller.register);
api.get("/branch/search/:idBranch",token.ensureAuth, controller.search);
api.put("/branch/edit/:idBranch",token.ensureAuth, controller.edit);
api.delete("/branch/delete/:idBranch",token.ensureAuth, controller.remove);
api.post("/branches/pdf", token.ensureAuth, controller.genPdf);
api.get("/branches/pdf/:idPdf", controller.getPdf);

module.exports = api;