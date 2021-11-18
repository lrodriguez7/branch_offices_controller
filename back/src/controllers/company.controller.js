
const companyModel = require("../models/company.model");





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

    params.nameCompany?schema.nameCompany = params.nameCompany:null;
    params.idCompany?schema.idCompany = params.idCompany:null;
    schema.sale = 0;
    params.sale?schema.sale = params.sale:null;
    params.rolUser?schema.rolUser = params.rolUser:null;
    
    console.log(schema)
    if(datatoken.rolUser == "admin"){
        if(
            params.nameCompany &&
            params.idCompany &&
            params.idCompany.length == 7
        ){
            companyModel.findOne({
                $or:[
                    {nameCompany: params.nameCompany},
                     {idCompany: params.idCompany}
                    ]}).exec((err, companyFound)=>{
                if(err){
                    jsonResponse.message = "Error al comprobar la empresa";

                    res.status(jsonResponse.error).send(jsonResponse);

                }else{
                    if(companyFound){
                        jsonResponse.error = 400;
                        jsonResponse.message = "Error de registro, la empresa ya existe";
                        jsonResponse.data = companyFound;

                        res.status(jsonResponse.error).send(jsonResponse);
                        statusClean();
                    }else{
                        registerModel = new companyModel(schema);

                        registerModel.save((err, companySaved)=>{
                            if(err){
                                jsonResponse.message = "Error al registrar empresa";

                                res.status(jsonResponse.error).send(jsonResponse);
                                statusClean();
                            }else{
                                jsonResponse.message = "empresa registrado!!";
                                jsonResponse.data = {companySaved};

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

function list(req, res){

    statusClean();
    
    var datatoken = req.user;
    
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        companyModel.find({}).exec((err, companiesFound)=>{
            if(err){
                jsonResponse.message = "error al listar las emppresas";
            }else{
                if(companiesFound && companiesFound.length > 0){
                    jsonResponse.error = 200;
                    jsonResponse.message = "empresas obtenidas";
                    jsonResponse.data = companiesFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontraron las empresas";
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
    
    var idCompany = req.params.idCompany

    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin"){
        companyModel.findOne({_id: idCompany}).exec((err, companyFound)=>{
            if(err){
                jsonResponse.message = "error al buscar empresa";
            }else{
                
                if(companyFound){
                    jsonResponse.error = 200;
                    jsonResponse.message = "empresa obtenida";
                    jsonResponse.data = companyFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontro la empresa";
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
    var idCompany = req.params.idCompany;
    var datatoken = req.user;

    var schema = {};
    
    params.idCompany?schema.idCompany = params.idCompany:null;
    params.nameCompany?schema.nameCompany = params.nameCompany:null;
    params.sale?schema.sale = params.sale:null;
    
    
    
    console.log(schema)
    if(datatoken.rolUser == "admin"){
        companyModel.findByIdAndUpdate(idCompany,schema, {new: true, useFindAndModify: false}, (err, companyUpdate)=>{
            if(err){
                jsonResponse.message = "error al editar empresa";
                
                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(companyUpdate){
                    jsonResponse.error = 200;
                    jsonResponse.message = "empresa actualizada!!"
                    jsonResponse.data = companyUpdate;

                    res.status(jsonResponse.error).send(jsonResponse);
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontro la empresa";

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
    
    var idCompany = req.params.idCompany;
    var datatoken = req.user;
    

    if(datatoken.rolUser == "admin"){
        companyModel.findByIdAndDelete(idCompany, (err, companyDelete)=>{
            if(err){
                jsonResponse.message = "error al eliminar empresa"

                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(companyDelete){
                    jsonResponse.error = 200;
                    jsonResponse.message = "empresa eliminada!!"

                    

                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "empresa no existente";

                    
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
    list,
    search,
    edit,
    remove
}