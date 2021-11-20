const Auth = require("../middlewares/auth");
const bcrypt = require("bcrypt-nodejs");

var token = new Auth();

const userModel = require("../models/user.model");
const branchModel = require("../models/branch.model");




var jsonResponse = {
    error: 500,
    message: null,
    data: null,
    token: null
}

// ================================================================================================= \\

function register(req, res){
    statusClean();
    var params = req.body;
    var datatoken = req.user;
    
    //all vars in use
    var registerModel;
    var schema = {};

    params.idCompany?schema.idCompany = params.idCompany:null;
    params.idPlace?schema.idPlace = params.idPlace:null;
    params.nameUser?schema.nameUser = params.nameUser:null;
    params.lastnameUser?schema.lastnameUser = params.lastnameUser:null;
    params.nickUser?schema.nickUser = params.nickUser:null;
    params.emailUser?schema.emailUser = params.emailUser:null;
    params.passwordUser?schema.passwordUser = bcrypt.hashSync(params.passwordUser):null;

    params.rolUser?schema.rolUser = params.rolUser:null;

    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idPlace:null;
    datatoken && datatoken.rolUser == "company"?schema.rolUser = "branch":null;
    
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(
            schema.idCompany &&
            params.idPlace &&
            params.nameUser &&
            params.lastnameUser &&
            params.nickUser &&
            params.emailUser &&
            params.passwordUser &&
            schema.rolUser &&
            params.idPlace.length == 5 ||
            params.idPlace.length == 7
        ){
            if(datatoken.rolUser == "company" && params.idPlace.length  == 7){
                jsonResponse.error = 400;
                jsonResponse.message = "no puedes crear otro admin";
                res.status(jsonResponse.error).send(jsonResponse);
                statusClean();
            }else{
                if(params.idPlace.length == 5){
                    branchModel.findOne({idBranch: schema.idPlace},(err,branchFound)=>{
                        if(err){
                            jsonResponse.message = "Error al comprobar el usuario";
        
                            res.status(jsonResponse.error).send(jsonResponse);
                            statusClean();
                        }else{
                            if(branchFound){
                                userModel.findOne({
                                    $or: [
                                        {emailUser: params.emailUser},
                                        {nickUser: params.nickUser}
                                    ]
                                }).exec((err, userFound)=>{
                                    if(err){
                                        jsonResponse.message = "Error al comprobar el usuario";
                    
                                        res.status(jsonResponse.error).send(jsonResponse);
                                        statusClean();
                                    }else{
                                        if(userFound){
                                            jsonResponse.error = 400;
                                            jsonResponse.message = "Error de registro, el usuario ya existe";
                                            jsonResponse.data = userFound;
                    
                                            res.status(jsonResponse.error).send(jsonResponse);
                                            statusClean();
                                        }else{
                                            registerModel = new userModel(schema);
                    
                                            registerModel.save((err, userSaved)=>{
                                                if(err){
                                                    jsonResponse.message = "Error al registrar usuario";
                    
                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                    statusClean();
                                                }else{
                                                    jsonResponse.error = 200;
                                                    jsonResponse.message = "usuario registrado!!";
                                                    jsonResponse.data = {userSaved};
                    
                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                    statusClean();
                                                    //login(req, res);
                                                }
                                            })
                                        }
                                    }
                                });
                                statusClean();
                            }else{
                                jsonResponse.error = 404
                                jsonResponse.message = "Error, no existe la sucursal que se le asigna al usuario";
                                
                                res.status(jsonResponse.error).send(jsonResponse);
                                statusClean();
                            }
                        }
                    })
                }else{
                    userModel.findOne({
                        $or: [
                            {emailUser: params.emailUser},
                            {nickUser: params.nickUser}
                        ]
                    }).exec((err, userFound)=>{
                        if(err){
                            jsonResponse.message = "Error al comprobar el usuario";
        
                            res.status(jsonResponse.error).send(jsonResponse);
                            statusClean();
                        }else{
                            if(userFound){
                                jsonResponse.error = 400;
                                jsonResponse.message = "Error de registro, el usuario ya existe";
                                jsonResponse.data = userFound;
        
                                res.status(jsonResponse.error).send(jsonResponse);
                                statusClean();
                            }else{
                                registerModel = new userModel(schema);
        
                                registerModel.save((err, userSaved)=>{
                                    if(err){
                                        jsonResponse.message = "Error al registrar usuario";
        
                                        res.status(jsonResponse.error).send(jsonResponse);
                                        statusClean();
                                    }else{
                                        jsonResponse.message = "usuario registrado!!";
                                        jsonResponse.data = {userSaved};
        
                                        res.status(jsonResponse.error).send(jsonResponse);
                                        statusClean();
                                        //login(req, res);
                                    }
                                })
                            }
                        }
                    });
                    statusClean();
                }
            }
        }else{
            jsonResponse.error = 400;
            jsonResponse.message = "rellene todos los campos obligatorios";
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        }
        statusClean();
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "no posees los permisos necesarios";
        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function login(req, res){
    
    statusClean();
    params = req.body;

    userModel.findOne({
        $or: [
            {emailUser: params.emailUser}, {nickUser: params.nickUser}
        ]
    },
    (err, userFound) => {
        if(err){
            jsonResponse.message = "Error al comprobar usuario";

            res.status(jsonResponse.error).send(jsonResponse);
        }else{
            if(userFound){
                if(bcrypt.compareSync(params.passwordUser, userFound.passwordUser)){
                    jsonResponse.error = 200;
                    jsonResponse.message = "sesion iniciada!!";
                    jsonResponse.data = userFound;
                    jsonResponse.token = token.createToken(userFound);
                }else{
                    jsonResponse.error = 403;
                    jsonResponse.message = "usuario o clave incorrecta";
                }
            }else{
                jsonResponse.error = 404;
                jsonResponse.message = "No existe el usuario";
                jsonResponse.data = null;
                jsonResponse.token = null;
            }
            
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        }
    }
    );
    statusClean();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function list(req, res){

    statusClean();
    
    var datatoken = req.user;
    var order = 1;
    
    if(datatoken.rolUser == "admin"){
        userModel.find({$or:[{rolUser: "company"},{rolUser: "branch"}]}).sort({idPlace: order}).exec((err, usersFound)=>{
            if(err){
                jsonResponse.message = "error al listar los usuarios";
            }else{
                if(usersFound && usersFound.length > 0){
                    jsonResponse.error = 200;
                    jsonResponse.message = "Usuarios obtenidos";
                    jsonResponse.data = usersFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontraron los usuarios";
                }
            }
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        });
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes acceso";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
    statusClean();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function search(req, res){

    statusClean();
    
    var _id = req.params._id

    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin"|| datatoken.rolUser == "company"){
        userModel.findOne({$and:[{_id: _id},
            {$or:[{rolUser: "company"},{rolUser: "branch"}]}]}).exec((err, userFound)=>{
            if(err){
                jsonResponse.message = "error al buscar usuario";
            }else{
                console.log(userFound)
                if(userFound ){
                    jsonResponse.error = 200;
                    jsonResponse.message = "Usuario obtenido";
                    jsonResponse.data = userFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontro el usuario";
                }
            }
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        })
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes acceso";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
    statusClean();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function edits(req, res){

    statusClean();

    var params = req.body;
    var idUser = req.params._id;
    var datatoken = req.user;

    var schema = {};
    
    params.idPlace?schema.idPlace = params.idPlace:null;
    params.nameUser?schema.nameUser = params.nameUser:null;
    params.lastnameUser?schema.lastnameUser = params.lastnameUser:null;
    params.nickUser?schema.nickUser = params.nickUser:null;
    params.emailUser?schema.emailUser = params.emailUser:null;
    params.passwordUser?schema.passwordUser = bcrypt.hashSync(params.passwordUser):null;
    datatoken.rolUser == "admin"?params.rolUser?schema.rolUser = params.rolUser:null:null;

    
    console.log(schema)
    if(datatoken.rolUser == "admin"|| datatoken.rolUser == "company"){
        userModel.findById(idUser,(err,userIdFound)=>{
            if(err){
                jsonResponse.message = "error, no se pudo editar el usuario";
                                                                                                                    
                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(userIdFound){
                    userModel.findOne({nickUser:schema.nick},(err,usersFound)=>{
                        if(usersFound){
                            if(err){
                                jsonResponse.message = "error, no se pudo editar el usuario";
                                                                                                                    
                                res.status(jsonResponse.error).send(jsonResponse);
                            }else{
                                if(usersFound){
                                    userModel.findOne({emailUser:schema.emailUser},(err,usersFounds)=>{
                                            if(err){
                                                jsonResponse.message = "error, no se pudo editar el usuario";
                                                                                                                    
                                                res.status(jsonResponse.error).send(jsonResponse);
                                            }else{
                                                if(usersFounds){
                                                    if(usersFound.nickUser == schema.nickUser && usersFound._id == idUser){
                                                        if(usersFounds.emailUser == schema.emailUser && usersFounds._id == idUser){
                                                            branchModel.findOne({idBranch: schema.idPlace},(err,branchFound)=>{
                                                                if(err){
                                                                    jsonResponse.message = "Error al comprobar el usuario";
                                                
                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                    statusClean();
                                                                }else{
                                                                    if(branchFound){
                                                                        userModel.findByIdAndUpdate(idUser,schema, {new: true, useFindAndModify: false}, (err, userUpdated)=>{
                                                                            if(err){
                                                                                jsonResponse.message = "error al editar usuario";
                                                                                
                                                                                res.status(jsonResponse.error).send(jsonResponse);
                                                                            }else{
                                                                                if(userUpdated){
                                                                                    jsonResponse.error = 200;
                                                                                    jsonResponse.message = "usuario actualizado!!"
                                                                                    jsonResponse.data = userUpdated;
                                                                
                                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                                }else{
                                                                                    jsonResponse.error = 404;
                                                                                    jsonResponse.message = "no se encontro el usuario";
                                                                
                                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                                }
                                                                            }
                                                                            statusClean();
                                                                        });
                                                                    }else{
                                                                        jsonResponse.error = 404;
                                                                        jsonResponse.message = "no se encontro la sucursal a la asignacion del usuario";
                                                    
                                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                                    }
                                                                }
                                                            });
                                                        }else{
                                                            jsonResponse.error = 400;
                                                            jsonResponse.message = "error, usuario con ese correo ya existente";

                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                        }
                                                    }else{
                                                        jsonResponse.error = 400;
                                                        jsonResponse.message = "error, usuario con ese nombre ya existente";

                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                    }
                                                }else{
                                                    if(usersFound.nickUser == schema.nickUser && usersFound._id == idUser){
                                                        branchModel.findOne({idBranch: schema.idPlace},(err,branchFound)=>{
                                                            if(err){
                                                                jsonResponse.message = "Error al comprobar el usuario";
                                            
                                                                res.status(jsonResponse.error).send(jsonResponse);
                                                                statusClean();
                                                            }else{
                                                                if(branchFound){
                                                                    userModel.findByIdAndUpdate(idUser,schema, {new: true, useFindAndModify: false}, (err, userUpdated)=>{
                                                                        if(err){
                                                                            jsonResponse.message = "error al editar usuario";
                                                                            
                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                        }else{
                                                                            if(userUpdated){
                                                                                jsonResponse.error = 200;
                                                                                jsonResponse.message = "usuario actualizado!!"
                                                                                jsonResponse.data = userUpdated;
                                                            
                                                                                res.status(jsonResponse.error).send(jsonResponse);
                                                                            }else{
                                                                                jsonResponse.error = 404;
                                                                                jsonResponse.message = "no se encontro el usuario";
                                                            
                                                                                res.status(jsonResponse.error).send(jsonResponse);
                                                                            }
                                                                        }
                                                                        statusClean();
                                                                    });
                                                                }else{
                                                                    jsonResponse.error = 404;
                                                                    jsonResponse.message = "no se encontro la sucursal a la asignacion del usuario";
                                                
                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                }
                                                            }
                                                        });
                                                    }else{
                                                        jsonResponse.error = 400;
                                                        jsonResponse.message = "error, usuario con ese nombre ya existente";
                                                                                                                    
                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                    }
                                                }
                                            }
                                    })
                                }else{
                                    userModel.findOne({emailUser:schema.emailUser},(err,usersFounds)=>{
                                            if(err){
                                                jsonResponse.message = "error, no se pudo editar el usuario";
                                                                                                                    
                                                res.status(jsonResponse.error).send(jsonResponse);
                                            }else{
                                                if(usersFounds){

                                                        if(usersFounds.emailUser == schema.emailUser && usersFounds._id == idUser){
                                                            branchModel.findOne({idBranch: schema.idPlace},(err,branchFound)=>{
                                                                if(err){
                                                                    jsonResponse.message = "Error al comprobar el usuario";
                                                
                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                    statusClean();
                                                                }else{
                                                                    if(branchFound){
                                                                        userModel.findByIdAndUpdate(idUser,schema, {new: true, useFindAndModify: false}, (err, userUpdated)=>{
                                                                            if(err){
                                                                                jsonResponse.message = "error al editar usuario";
                                                                                
                                                                                res.status(jsonResponse.error).send(jsonResponse);
                                                                            }else{
                                                                                if(userUpdated){
                                                                                    jsonResponse.error = 200;
                                                                                    jsonResponse.message = "usuario actualizado!!"
                                                                                    jsonResponse.data = userUpdated;
                                                                
                                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                                }else{
                                                                                    jsonResponse.error = 404;
                                                                                    jsonResponse.message = "no se encontro el usuario";
                                                                
                                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                                }
                                                                            }
                                                                            statusClean();
                                                                        });
                                                                    }else{
                                                                        jsonResponse.error = 404;
                                                                        jsonResponse.message = "no se encontro la sucursal a la asignacion del usuario";
                                                    
                                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                                    }
                                                                }
                                                            });
                                                        }else{
                                                            jsonResponse.error = 400;
                                                            jsonResponse.message = "error,usuario con ese correo ya existente";
                                                                                                                        
                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                        }
                                                }else{
                                                    branchModel.findOne({idBranch: schema.idPlace},(err,branchFound)=>{
                                                        if(err){
                                                            jsonResponse.message = "Error al comprobar el usuario";
                                        
                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                            statusClean();
                                                        }else{
                                                            if(branchFound){
                                                                userModel.findByIdAndUpdate(idUser,schema, {new: true, useFindAndModify: false}, (err, userUpdated)=>{
                                                                    if(err){
                                                                        jsonResponse.message = "error al editar usuario";
                                                                        
                                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                                    }else{
                                                                        if(userUpdated){
                                                                            jsonResponse.error = 200;
                                                                            jsonResponse.message = "usuario actualizado!!"
                                                                            jsonResponse.data = userUpdated;
                                                        
                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                        }else{
                                                                            jsonResponse.error = 404;
                                                                            jsonResponse.message = "no se encontro el usuario";
                                                        
                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                        }
                                                                    }
                                                                    statusClean();
                                                                });
                                                            }else{
                                                                jsonResponse.error = 404;
                                                                jsonResponse.message = "no se encontro la sucursal a la asignacion del usuario";
                                            
                                                                res.status(jsonResponse.error).send(jsonResponse);
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                    })
                                }
                            }
                        }
                    })
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "No se encontro el usuario a editar";

                    res.status(jsonResponse.error).send(jsonResponse);
                }
            }
        })
        
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes permisos para editar";

        res.status(jsonResponse.error).send(jsonResponse);
    }
    statusClean();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function edit(req,res){
    statusClean();

    var params = req.body;
    var idUser = req.params._id;
    var datatoken = req.user;

    var schema = {};
    
    params.idPlace?schema.idPlace = params.idPlace:null;
    params.nameUser?schema.nameUser = params.nameUser:null;
    params.lastnameUser?schema.lastnameUser = params.lastnameUser:null;
    params.nickUser?schema.nickUser = params.nickUser:null;
    params.emailUser?schema.emailUser = params.emailUser:null;
    params.passwordUser?schema.passwordUser = bcrypt.hashSync(params.passwordUser):null;
    datatoken.rolUser == "admin"?params.rolUser?schema.rolUser = params.rolUser:null:null;

    
    console.log(schema)
    if(datatoken.rolUser == "admin"|| datatoken.rolUser == "company"){
        branchModel.findOne({idBranch: schema.idPlace},(err,branchFound)=>{
            if(err){
                jsonResponse.message = "Error al comprobar el usuario";

                res.status(jsonResponse.error).send(jsonResponse);
                statusClean();
            }else{
                if(branchFound){
                    userModel.findByIdAndUpdate(idUser,schema, {new: true, useFindAndModify: false}, (err, userUpdated)=>{
                        if(err){
                            jsonResponse.message = "error al editar usuario";
                            
                            res.status(jsonResponse.error).send(jsonResponse);
                        }else{
                            if(userUpdated){
                                jsonResponse.error = 200;
                                jsonResponse.message = "usuario actualizado!!"
                                jsonResponse.data = userUpdated;
            
                                res.status(jsonResponse.error).send(jsonResponse);
                            }else{
                                jsonResponse.error = 404;
                                jsonResponse.message = "no se encontro el usuario";
            
                                res.status(jsonResponse.error).send(jsonResponse);
                            }
                        }
                        statusClean();
                    });
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontro la sucursal a la asignacion del usuario";

                    res.status(jsonResponse.error).send(jsonResponse);
                }
            }
        });
    }else{

    }
    

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function remove(req, res){
    
    statusClean();
    
    var idUser = req.params._id;
    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        userModel.findByIdAndDelete(idUser, (err, userDeleted)=>{
            if(err){
                jsonResponse.message = "error al eliminar usuario"

                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(userDeleted){
                    jsonResponse.error = 200;
                    jsonResponse.message = "Ususario eliminado!!"

                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "Usuario no existente";

                    
                }
                res.status(jsonResponse.error).send(jsonResponse)
            }
        })
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes permisos para eliminar";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function removeAuto(req, res){
    
    statusClean();
    
    var params = req.body;
    var idPlace = params.idPlace
    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin"){
        userModel.findOneAndDelete({idPlace: idPlace}, (err, userDeleted)=>{
            if(err){
                jsonResponse.message = "error al eliminar usuario"

                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(userDeleted){
                    jsonResponse.error = 200;
                    jsonResponse.message = "Ususario eliminado!!"

                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "Usuario no existente";

                    
                }
                res.status(jsonResponse.error).send(jsonResponse)
            }
        })
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes permisos para eliminar";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function listCompany(req, res){

    statusClean();
    
    var datatoken = req.user;
    var order = 1;
    var idPlace = datatoken.idPlace;
    if(datatoken.rolUser == "company"){
        userModel.find({$and:[{idCompany: idPlace},{rolUser: "branch"}]}).sort({idPlace: order}).exec((err, usersFound)=>{
            if(err){
                jsonResponse.message = "error al listar los usuarios";
            }else{
                console.log(usersFound)
                if(usersFound && usersFound.length > 0){
                    jsonResponse.error = 200;
                    jsonResponse.message = "Usuarios obtenidos";
                    jsonResponse.data = usersFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontraron los usuarios";
                }
            }
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        });
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes acceso";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
    statusClean();
}


//=====================================================================================================\\
//                                         Reusable functions 
//=====================================================================================================\\

function statusClean(){
    jsonResponse = {
        error: 500,
        message: null,
        data: null,
        token: null
    }
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

module.exports = {
    register,
    login,
    list,
    search,
    edit,
    remove,
    removeAuto,
    listCompany,
}