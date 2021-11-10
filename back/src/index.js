const app = require("./app");
const mongoose = require("mongoose");
//const userModel = require("./models/user.model");
const bcrypt = require("bcrypt-nodejs");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://lrodriguez:q1w2e3r4@branchofficecontroller.cjvld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        //initApp();
        console.log("servidor 3000: activo");
        app.listen(3000, null);

    }).catch(err =>{

        console.log(err);
        
    });