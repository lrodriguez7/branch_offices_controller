
const htmlPdf= require("html-pdf");
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

    params.idBranch?schema.idBranch = params.idBranch:null;
    params.nameBranch?schema.nameBranch = params.nameBranch:null;
    params.addressBranch?schema.addressBranch = params.addressBranch:null;
    params.idCompany?schema.idCompany = params.idCompany:null;
    schema.sale = 0;
    params.sale?schema.sale = params.sale:null;
    datatoken && datatoken.rolUser== "company"?schema.idCompany = datatoken.idPlace:null;
    
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(
            params.idBranch &&
            params.nameBranch &&
            params.addressBranch &&
            schema.idCompany &&
            schema.idCompany.length == 7 &&
            params.idBranch.length == 5
        ){
            branchModel.findOne({
                $or:[
                    {idBranch: params.idBranch},{nameBranch: params.nameBranch},
                     {idCompany: params.idCompany}
                    ]}).exec((err, branchFound)=>{
                if(err){
                    jsonResponse.message = "Error al comprobar la sucursal";

                    res.status(jsonResponse.error).send(jsonResponse);

                }else{
                    if(branchFound){
                        jsonResponse.error = 400;
                        jsonResponse.message = "Error de registro, la sucursal ya existe";
                        jsonResponse.data = branchFound;

                        res.status(jsonResponse.error).send(jsonResponse);
                        statusClean();
                    }else{
                        registerModel = new branchModel(schema);

                        registerModel.save((err, branchSaved)=>{
                            if(err){
                                jsonResponse.message = "Error al registrar sucursal";

                                res.status(jsonResponse.error).send(jsonResponse);
                                statusClean();
                            }else{
                                jsonResponse.error = 200;
                                jsonResponse.message = "sucursal registrado!!";
                                jsonResponse.data = {branchSaved};

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
    
    var params = req.body;
    var datatoken = req.user;

    var schema = {}
    datatoken && datatoken.rolUser== "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;
    datatoken && datatoken.rolUser== "company"?schema.idCompany = datatoken.idPlace:null;
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        branchModel.find({idCompany: schema.idCompany}).exec((err, branchesFound)=>{
            if(err){
                jsonResponse.message = "error al listar las sucursales";
            }else{
                if(branchesFound && branchesFound.length > 0){
                    jsonResponse.error = 200;
                    jsonResponse.message = "sucursales obtenidas";
                    jsonResponse.data = branchesFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontraron las sucursales";
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
    
    var idBranch = req.params.idBranch

    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        branchModel.findOne({_id: idBranch}).exec((err, branchFound)=>{
            if(err){
                jsonResponse.message = "error al buscar sucursal";
            }else{
                
                if(branchFound){
                    jsonResponse.error = 200;
                    jsonResponse.message = "sucursal obtenida";
                    jsonResponse.data = branchFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontro la sucursal";
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
    var idBranch = req.params.idBranch;
    var datatoken = req.user;

    var schema = {};
    
    params.idBranch?schema.idBranch = params.idBranch:null;
    params.nameBranch?schema.nameBranch = params.nameBranch:null;
    params.addressBranch?schema.addressBranch = params.addressBranch:null;
    params.idCompany?schema.idCompany = params.idCompany:null;
    params.sale?schema.sale = params.sale:null;
    
    
    
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        branchModel.findByIdAndUpdate(idBranch,schema, {new: true, useFindAndModify: false}, (err, branchUpdate)=>{
            if(err){
                jsonResponse.message = "error al editar sucursal";
                
                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(branchUpdate){
                    jsonResponse.error = 200;
                    jsonResponse.message = "sucursal actualizada!!"
                    jsonResponse.data = branchUpdate;

                    res.status(jsonResponse.error).send(jsonResponse);
                    statusClean();
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontro la sucursal";

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
    
    var idBranch = req.params.idBranch;
    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        branchModel.findByIdAndDelete(idBranch, (err, branchDelete)=>{
            if(err){
                jsonResponse.message = "error al eliminar sucursal"

                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(branchDelete){
                    jsonResponse.error = 200;
                    jsonResponse.message = "sucursal eliminada!!"

                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "sucursal no existente";

                    
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
function genPdf(req, res){
    writePdf(req, res);
  }



function writePdf(req, res){
    statusClean();
    
    var params = req.body;
    var datatoken = req.user;

    var schema = {}
    datatoken && datatoken.rolUser== "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;
    datatoken && datatoken.rolUser== "company"?schema.idCompany = datatoken.idPlace:null;
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        branchModel.find({idCompany: schema.idCompany}).exec((err, branchesFound)=>{
            if(err){
                jsonResponse.message = "error al listar las sucursales";
            }else{
                if(branchesFound && branchesFound.length > 0){
                    var contentPDF =
                        `<!DOCTYPE html>
                        <html>
                        <head>
                          <style>*{font-family: arial;} table{width: 100%; border-collapse: collapse;} td{width: 10%;} .scoreData{background-color: black; color: white; font-weight: bolder;}</style>
                        </head>
                        <body>
                        <h3>Branch</h3>
                        <table>
                          <tr>
                            <td class='scoreData'>_id</td>
                            <td class='scoreData'>Identificador</td>
                            <td class='scoreData'>Compania</td>
                            <td class='scoreData'>Name</td>
                            <td class='scoreData'>Address</td>
                            <td class='scoreData'>Sale</td>
                          </tr>`;
                          branchesFound.forEach(dato => {
                          contentPDF += `<tr>
                            <td>` + dato._id + `</td>
                            <td>` + dato.idCompany + `</td>
                            <td>` + dato.idBranch + `</td>
                            <td>` + dato.nameBranch + `</td>
                            <td>` + dato.addressBranch + `</td>
                            <td>` + dato.sale + `</td>
                          </tr>`;
                        });
            
                      contentPDF += `</table>
                    </body>
                    </html>`;
  
                    htmlPdf
                    .create(contentPDF)
                    .toFile(
                      "../pdf/branch/" + datatoken._id + ".pdf",
                      (err, response) => {
                        if (err) {
                          res.status(500).send({
                            message:"Error al crear el pdf"
                          });
                        } else {
                          console.log(__dirname);
                          res.status(200).send({ url: "https://branch-nodejs.herokuapp.com/api/branches/pdf/" + datatoken._id});
                        }
                      }
                    );
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontraron las sucursales";
                    res.status(jsonResponse.error).send(jsonResponse);
                    statusClean();
                }
            }
        });
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes acceso";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
    statusClean();
    
  }
  
  function getPdf(req, res){
    res.download(__dirname + "../../../pdf/branch/" + req.params.idPdf + ".pdf");
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
    remove,
    getPdf,
    genPdf
}