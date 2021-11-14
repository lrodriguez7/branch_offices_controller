const app = require("./app");
const mongoose = require("mongoose");
const userModel = require("./models/user.model");
const companyModel = require("./models/company.model");
const bcrypt = require("bcrypt-nodejs");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://lrodriguez:q1w2e3r4@branchofficecontroller.cjvld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        initApp();
        console.log("servidor 3000: activo");
        app.listen(3000, null);

    }).catch(err =>{

        console.log(err);
        
    });

// =====================================================================================================

//default users

// =====================================================================================================
function initApp(){
    defaultAdmin();
    defaultUser();
    defaultClient();
    defaultCompany();
    
}

// =====================================================================================================


    function defaultAdmin(){
        userModel.findOne({$or:[{nickUser: "admin"},{emailUser: "admin@gmail.com"}]}, (err, user)=>{
            if(err){
                console.log(err);
            }else{
                if(!user){
                    model = new userModel({
                        nameUser: "admin",
                        lastnameUser: "admin",
                        nickUser: "admin",
                        emailUser: "admin@gmail.com",
                        rolUser: "admin",
                        passwordUser: bcrypt.hashSync("123456")
                    });
                    model.save();
                    console.log("admin default creado");
                }else{
                    console.log("admin default");
                }
            }
        })
        
    }

// =====================================================================================================

    function defaultUser(){
        userModel.findOne({$or:[{nickUser: "AdminMc"},{emailUser: "AdminMc@gmail.com"}]}, (err, user)=>{
            if(err){
                console.log(err);
            }else{
                if(!user){
                    model = new userModel({
                        nameUser: "admin",
                        lastnameUser: "mcdonalds",
                        nickUser: "AdminMc",
                        emailUser: "AdminMc@gmail.com",
                        rolUser: "company",
                        passwordUser: bcrypt.hashSync("123456")
                    });
                    model.save();
                    console.log("user default creado");
                }else{
                    console.log("user default");
                }
            }
        })
        
    }

// =====================================================================================================
function defaultClient(){
    userModel.findOne({$or:[{nickUser: "client1"},{emailUser: "client1@gmail.com"}]}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(!user){
                model = new userModel({
                    nameUser: "client",
                    lastnameUser: "client",
                    nickUser: "client1",
                    emailUser: "client1@gmail.com",
                    passwordUser: bcrypt.hashSync("123456"),
                    rolUser: "branch"
                });
                model.save();
                console.log("client default creado");
            }else{
                console.log("client default");
            }
        }
    })
    
}

function defaultCompany(){
    companyModel.findOne({nameCompany: "McDonald's"}, (err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(!user){
                model = new companyModel({
                    nameCompany: "McDonald's",
                    
                });
                model.save();
                console.log("company default creado");
            }else{
                console.log("company default");
            }
        }
    })
}

