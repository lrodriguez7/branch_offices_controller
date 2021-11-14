const Auth = require("../middlewares/auth");
const bcrypt = require("bcrypt-nodejs");

var token = new Auth();

const userModel = require("../models/user.model");




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

    params.idPlace?schema.idUser = params.idUser:null;
    params.nameUser?schema.nameUser = params.nameUser:null;
    params.lastnameUser?schema.lastnameUser = params.lastnameUser:null;
    params.nickUser?schema.nickUser = params.nickUser:null;
    params.emailUser?schema.emailUser = params.emailUser:null;
    params.passwordUser?schema.passwordUser = bcrypt.hashSync(params.passwordUser):null;

    params.rolUser?schema.rolUser = params.rolUser:null;
    
    
    if(datatoken.rolUser == "admin"){
        if(
            params.idPlace &&
            params.nameUser &&
            params.lastnameUser &&
            params.nickUser &&
            params.emailUser &&
            params.passwordUser &&
            params.rolUser
        ){
            userModel.findOne({
                $and: [
                    {idPlace: params.idPlace},
                    {nickUser: params.nickUser}
                ]
            }).exec((err, userFound)=>{
                if(err){
                    jsonResponse.message = "Error al comprobar el usuario";

                    res.status(jsonResponse.error).send(jsonResponse);

                }else{
                    if(userFound){
                        jsonResponse.error = 400;
                        jsonResponse.message = "Error de registro, el usuario ya existe";
                        jsonResponse.data = userFound;

                        res.status(jsonResponse.error).send(jsonResponse);

                    }else{
                        registerModel = new userModel(schema);

                        registerModel.save((err, userSaved)=>{
                            if(err){
                                jsonResponse.message = "Error al registrar usuario";

                                res.status(jsonResponse.error).send(jsonResponse);

                            }else{
                                jsonResponse.message = "usuario registrado!!";
                                jsonResponse.data = {userSaved};

                                res.status(jsonResponse.error).send(jsonResponse);

                                //login(req, res);
                            }
                        })
                    }
                }
            });
            statusClean();
        }else{
            jsonResponse.error = 400;
            jsonResponse.message = "rellene todos los campos obligatorios";
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        }
        statusClean();
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "rellene todos los campos obligatorios";
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
    
    var idUser = req.params.idUser

    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin"){
        userModel.findOne({$and:[{idUser: idUser},
            {$or:[{rolUser: "company"},{rolUser: "branch"}]}]}).exec((err, userFound)=>{
            if(err){
                jsonResponse.message = "error al buscar usuario";
            }else{
                if(userFound && userFound.length > 0){
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

function edit(req, res){

    statusClean();

    var params = req.body;
    var idUser = req.params.idUser;
    var datatoken = req.user;

    var schema = {};
    
    params.idUser?schema.idUser = params.idUser:null;
    params.nameUser?schema.nameUser = params.nameUser:null;
    params.lastnameUser?schema.lastnameUser = params.lastnameUser:null;
    params.nickUser?schema.nickUser = params.nickUser:null;
    params.emailUser?schema.emailUser = params.emailUser:null;
    params.passwordUser?schema.passwordUser = bcrypt.hashSync(params.passwordUser):null;
    params.rolUser?schema.rolUser = params.rolUser:null; 
    
    console.log(schema)
    if(datatoken.rolUser == "admin"){
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
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes permisos para editar";

        res.status(jsonResponse.error).send(jsonResponse);
    }
    statusClean();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function remove(req, res){
    
    statusClean();
    
    var idUser = req.params.idUser;
    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin"){
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
        jsonResponse.message = "No tienes permisos para editar";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
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
    remove
}