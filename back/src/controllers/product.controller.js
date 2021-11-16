
const productModel = require("../models/product.model");





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

    
    params.nameProduct?schema.nameProduct = params.nameProduct:null;
    params.nameProvedor?schema.nameProvedor = params.nameProvedor:null;
    params.stock?schema.stock = params.stock:null;
    params.sale?schema.sale = params.sale:null;
    
    
    datatoken && datatoken.rolUser == "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;

    params.idDestiny?schema.idDestiny = params.idDestiny:null;
    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idPlace:null;

    
    
    console.log(schema)
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(
            schema.idCompany &&
            params.nameProduct &&
            params.nameProvedor &&
            params.stock
            ){
                productModel.findOne({
                    $and:[
                        {$or:[{nameProvedor: params.nameProvedor},{nameProduct: params.nameProduct}]},
                         {idCompany: params.idCompany}
                        ]}).exec((err, productFound)=>{
                    if(err){
                        jsonResponse.message = "Error al comprobar el producto";
    
                        res.status(jsonResponse.error).send(jsonResponse);
    
                    }else{
                        if(productFound){
                            jsonResponse.error = 400;
                            jsonResponse.message = "Error de registro, el producto ya existe";
                            jsonResponse.data = productFound;
    
                            res.status(jsonResponse.error).send(jsonResponse);
                            statusClean();
                        }else{
                            schema.idDestiny=schema.idCompany
                            registerModel = new productModel(schema);
    
                            registerModel.save((err, productSaved)=>{
                                if(err){
                                    jsonResponse.message = "Error al registrar producto";
    
                                    res.status(jsonResponse.error).send(jsonResponse);
                                    statusClean();
                                }else{
                                    jsonResponse.message = "producto registrado!!";
                                    jsonResponse.data = {productSaved};
    
                                    res.status(jsonResponse.error).send(jsonResponse);
                                    statusClean();
                                    
                                    //login(req, res);
                                }
                            })
                        }
                    }
                });
            }else{
                jsonResponse.error = 400;
                jsonResponse.message = "llene todos los campos obligatorios";
                res.status(jsonResponse.error).send(jsonResponse);
                statusClean();
            }
            

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
    
    var schema = {};

    datatoken && datatoken.rolUser == "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;
    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idCompany:null;
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        productModel.find({$and:[{idCompany: schema.idCompany},{idDestiny: schema.idCompany}]}).exec((err, productFound)=>{
            if(err){
                jsonResponse.message = "error al listar los productos";
            }else{
                if(productFound && productFound.length > 0){
                    jsonResponse.error = 200;
                    jsonResponse.message = "productos obtenidos";
                    jsonResponse.data = productFound;
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontraron los productos";
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

function edit(req, res){

    statusClean();

    var params = req.body;
    var idProduct = req.params.idProduct;
    var datatoken = req.user;

    var schema = {};
    
    params.nameProduct?schema.nameProduct = params.nameProduct:null;
    params.nameProvedor?schema.nameProvedor = params.nameProvedor:null;
    params.stock?schema.stock = params.stock:null;
    params.sale?schema.sale = params.sale:null;
    
    
    
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        productModel.findByIdAndUpdate(idProduct,schema, {new: true, useFindAndModify: false}, (err, productUpdate)=>{
            if(err){
                jsonResponse.message = "error al editar producto";
                
                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(productUpdate){
                    jsonResponse.error = 200;
                    jsonResponse.message = "producto actualizado!!"
                    jsonResponse.data = productUpdate;

                    res.status(jsonResponse.error).send(jsonResponse);
                    statusClean();
                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "no se encontro el producto";

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
    
    var idProduct = req.params.idProduct;
    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        productModel.findByIdAndDelete(idProduct, (err, productDelete)=>{
            if(err){
                jsonResponse.message = "error al eliminar producto"

                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(productDelete){
                    jsonResponse.error = 200;
                    jsonResponse.message = "producto eliminada!!"

                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "producto no existente";

                    
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

//=====================================================================================================\\
//                                         branch functions 
//=====================================================================================================\\


function add(req,res){

    statusClean();
    var params = req.body;
    var datatoken = req.user;
    
    //all vars in use
    
    var registerModel;
    var schema = {};
    var schema2 = {};
    
    params.nameProduct?schema.nameProduct = params.nameProduct:null;
    params.nameProvedor?schema.nameProvedor = params.nameProvedor:null;
    params.stock?schema.stock = params.stock:null;
    params.sale?schema.sale = params.sale:null;
    params.idDestiny?schema.idDestiny = params.idDestiny:null;

    datatoken && datatoken.rolUser == "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;

    
    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idPlace:null;

    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(
            schema.idCompany &&
            params.nameProduct &&
            params.nameProvedor &&
            params.stock &&
            params.idDestiny
            ){
                productModel.findOne({$and:[
                    {idCompany:schema.idCompany},
                    {nameProduct:params.nameProduct},
                    {nameProvedor:params.nameProvedor},
                    {idDestiny:schema.idCompany},
                ]}).exec((err, productFound)=>{
                    if(err){
                        jsonResponse.message = "Error al registrar producto";
                                    
                        res.status(jsonResponse.error).send(jsonResponse);
                        statusClean();
                    }else{
                        if(productFound){
                            if(productFound.stock > schema.stock){
                                
                                schema2.stock = productFound.stock - schema.stock
                                productModel.findOneAndUpdate({$and:[
                                    {idCompany: schema.idCompany},
                                    {nameProduct: params.nameProduct},
                                    {nameProvedor: params.nameProvedor},
                                ]},schema2,
                                    {new: true, useFindAndModify: false}, (err, productUpdate)=>{
                                        if(err){
                                            jsonResponse.message = "Error al registrar producto";
                                    
                                            res.status(jsonResponse.error).send(jsonResponse);
                                            statusClean();
                                        }else{
                                            if(productUpdate){
                                                productModel.findOne({$and:[
                                                    {idCompany: schema.idCompany},
                                                    {nameProduct: schema.nameProduct},
                                                    {nameProvedor: schema.nameProvedor},
                                                    {idDestiny: params.idDestiny},
                                                ]}).exec((err,productFound)=>{
                                                    if(err){
                                                        jsonResponse.message = "Error al registrar producto";
                                    
                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                        statusClean();
                                                    }else{
                                                        if(productFound){
                                                            productFound.stock = parseInt(productFound.stock)
                                                            schema.stock = parseInt(schema.stock)
                                                            schema.stock = productFound.stock + schema.stock
                                                            console.log(schema)
                                                            console.log(params.idDestiny)
                                                            productModel.findOneAndUpdate({$and:[
                                                                {idCompany: schema.idCompany},
                                                                {nameProduct: schema.nameProduct},
                                                                {nameProvedor: schema.nameProvedor},
                                                                {idDestiny: params.idDestiny},
                                                            ]},schema,
                                                                {new: true, useFindAndModify: false}, (err, productUpdate)=>{
                                                                    if(err){
                                                                        jsonResponse.message = "Error al registrar producto";
                                    
                                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                                        statusClean();
                                                                    }else{
                                                                        if(productUpdate){
                                                                            jsonResponse.error = 200;
                                                                            jsonResponse.message = "producto actualizado!!"
                                                                            jsonResponse.data = productUpdate;

                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                            statusClean();
                                                                        }else{
                                                                            jsonResponse.error = 404;
                                                                            jsonResponse.message = "No existe el producto";
                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                            statusClean();
                                                                        }
                                                                    }
                                                                })
                                                        }else{
                                                            registerModel = new productModel(schema)

                                                            registerModel.save((err, productSaved)=>{
                                                                if(err){
                                                                    jsonResponse.message = "Error al registrar producto";
                                    
                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                    statusClean();
                                                                }else{
                                                                    jsonResponse.error = 200;
                                                                    jsonResponse.message = "producto registrado!!";
                                                                    jsonResponse.data = {productSaved};
                                    
                                                                    res.status(jsonResponse.error).send(jsonResponse);
                                                                    statusClean();
                                                                    
                                                                    
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            }else{
                                                jsonResponse.error = 404;
                                                jsonResponse.message = "No existe el producto";
                                                res.status(jsonResponse.error).send(jsonResponse);
                                                statusClean();
                                            }
                                        }
                                    })
                            }else{
                                jsonResponse.error = 400;
                                jsonResponse.message = "Error, cantidad mayor a la cantidad de bodega";
                                res.status(jsonResponse.error).send(jsonResponse);
                                statusClean();
                            }
                            
                        }else{
                            jsonResponse.error = 404;
                            jsonResponse.message = "No existe el producto";
                            res.status(jsonResponse.error).send(jsonResponse);
                            statusClean();
                        }
                    }
                })
            }else{
                jsonResponse.error = 400;
                jsonResponse.message = "llene todos los campos obligatorios";
                res.status(jsonResponse.error).send(jsonResponse);
                statusClean();
            }
            

    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "no posees los permisos necesarios";
        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function table(req,res){

    statusClean();
    var params = req.body;
    var datatoken = req.user;
    
    var schema = {};

    datatoken && datatoken.rolUser == "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;
    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idCompany:null;
    params.idDestiny?schema.idDestiny = params.idDestiny:null;
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(params.idDestiny){
            productModel.find({$and:[{idCompany: schema.idCompany},{idDestiny: schema.idDestiny}]}).exec((err, productFound)=>{
                if(err){
                    jsonResponse.message = "error al listar los productos";
                }else{
                    if(productFound && productFound.length > 0){
                        jsonResponse.error = 200;
                        jsonResponse.message = "productos obtenidos";
                        jsonResponse.data = productFound;
                    }else{
                        jsonResponse.error = 404;
                        jsonResponse.message = "no se encontraron los productos";
                    }
                }
                res.status(jsonResponse.error).send(jsonResponse);
                statusClean();
            });
        statusClean();
    
        }else{
            jsonResponse.error = 403;
            jsonResponse.message = "Error, especificar el sucursal del producto a mostrar";

            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        }
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "No tienes acceso";

        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
        
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function change(req,res){
    
    statusClean();
    var params = req.body;
    var datatoken = req.user;
    
    //all vars in use
    
    
    var schema = {};
    var schema2 = {};
    
    params.nameProduct?schema.nameProduct = params.nameProduct:null;
    params.nameProvedor?schema.nameProvedor = params.nameProvedor:null;
    params.stock?schema.stock = params.stock:null;
    params.sale?schema.sale = params.sale:null;
    params.idDestiny?schema.idDestiny = params.idDestiny:null;

    datatoken && datatoken.rolUser == "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;

    
    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idPlace:null;

    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(
            schema.idCompany &&
            params.nameProduct &&
            params.nameProvedor &&
            params.stock &&
            params.idDestiny
            ){
                productModel.findOne({$and:[
                    {idCompany:schema.idCompany},
                    {nameProduct:params.nameProduct},
                    {nameProvedor:params.nameProvedor},
                    {idDestiny:schema.idCompany},
                ]}).exec((err, productFounds)=>{
                    if(err){
                        jsonResponse.message = "Error al registrar producto";
                                    
                        res.status(jsonResponse.error).send(jsonResponse);
                        statusClean();
                    }else{
                        if(productFounds){
                            if(productFounds.stock > schema.stock){
                                productModel.findOne({$and:[
                                    {idCompany: schema.idCompany},
                                    {nameProduct: schema.nameProduct},
                                    {nameProvedor: schema.nameProvedor},
                                    {idDestiny: params.idDestiny},
                                ]}).exec((err,productFound)=>{
                                    if(err){
                                        jsonResponse.message = "Error al registrar producto";
                    
                                        res.status(jsonResponse.error).send(jsonResponse);
                                        statusClean();
                                    }else{
                                        if(productFound){
                                            productFound.stock = parseInt(productFound.stock)
                                            schema.stock = parseInt(schema.stock)
                                            productFound.stock = productFound.stock + schema.stock
                                            if(productFound.stock >= 0){
                                                schema2.stock = productFounds.stock - schema.stock
                                                productModel.findOneAndUpdate({$and:[
                                                    {idCompany: schema.idCompany},
                                                    {nameProduct: params.nameProduct},
                                                    {nameProvedor: params.nameProvedor},
                                                ]},schema2,
                                                    {new: true, useFindAndModify: false}, (err, productUpdate)=>{
                                                        if(err){
                                                            jsonResponse.message = "Error al registrar producto";
                                                        
                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                            statusClean();
                                                        }else{
                                                            if(productUpdate){
                                                                schema.stock = productFound.stock
                                                                console.log(schema)
                                                                console.log(params.idDestiny)
                                                                productModel.findOneAndUpdate({$and:[
                                                                    {idCompany: schema.idCompany},
                                                                    {nameProduct: schema.nameProduct},
                                                                    {nameProvedor: schema.nameProvedor},
                                                                    {idDestiny: params.idDestiny},
                                                                ]},schema,
                                                                {new: true, useFindAndModify: false}, (err, productUpdate)=>{
                                                                    if(err){
                                                                        jsonResponse.message = "Error al registrar producto";
                                                                    
                                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                                        statusClean();
                                                                    }else{
                                                                        if(productUpdate){
                                                                            jsonResponse.error = 200;
                                                                            jsonResponse.message = "producto actualizado!!"
                                                                            jsonResponse.data = productUpdate;
                                                                        
                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                            statusClean();
                                                                        }else{
                                                                            jsonResponse.error = 404;
                                                                            jsonResponse.message = "No existe el producto";
                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                            statusClean();
                                                                        }
                                                                    }
                                                                })
                                                            }else{
                                                                jsonResponse.error = 400;
                                                                jsonResponse.message = "Error, al actualizar la bodega";

                                                                res.status(jsonResponse.error).send(jsonResponse);
                                                                statusClean();
                                                            }
                                                }})
                                            }else{
                                                jsonResponse.error = 400;
                                                jsonResponse.message = "Error, cantidad menor al producto de sucursal";
                                                
                                                
                                                res.status(jsonResponse.error).send(jsonResponse);
                                                statusClean();
                                            }
                                            
                                        }else{
                                            
                                            jsonResponse.error = 404;
                                            jsonResponse.message = "Error, el producto no existe en la sucursal";
                                            
                    
                                            res.status(jsonResponse.error).send(jsonResponse);
                                            statusClean();
                                                    
                                                    
                                                
                                            
                                        }
                                    }
                                })
                                
                            }else{
                                jsonResponse.error = 400;
                                jsonResponse.message = "Error, cantidad mayor a la cantidad de bodega";
                                res.status(jsonResponse.error).send(jsonResponse);
                                statusClean();
                            }
                            
                        }else{
                            jsonResponse.error = 404;
                            jsonResponse.message = "No existe el producto en bodega";
                            res.status(jsonResponse.error).send(jsonResponse);
                            statusClean();
                        }
                    }
                })
            }else{
                jsonResponse.error = 400;
                jsonResponse.message = "llene todos los campos obligatorios";
                res.status(jsonResponse.error).send(jsonResponse);
                statusClean();
            }
            

    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "no posees los permisos necesarios";
        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }

}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function deleter(req,res){

    statusClean();
    
    var idProduct = req.params.idProduct;
    var datatoken = req.user;
    
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        productModel.findByIdAndDelete(idProduct, (err, productDelete)=>{
            if(err){
                jsonResponse.message = "error al eliminar producto"

                res.status(jsonResponse.error).send(jsonResponse);
            }else{
                if(productDelete){
                    jsonResponse.error = 200;
                    jsonResponse.message = "producto eliminada!!"

                }else{
                    jsonResponse.error = 404;
                    jsonResponse.message = "producto no existente";

                    
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
    edit,
    remove,
    add,
    table,
    change,

}