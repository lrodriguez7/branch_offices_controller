
const { findOne } = require("../models/product.model");
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
    
    params.stock?schema.stock = params.stock:null;

    
    
    
    console.log(schema)
    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(params.stock){
            productModel.findById(idProduct,(err,productFound)=>{
                if(err){
                    jsonResponse.message = "error al editar producto";
                                
                    res.status(jsonResponse.error).send(jsonResponse);
                    statusClean();
                }else{
                    if(productFound){
                        productFound.stock = parseInt(productFound.stock);
                        schema.stock = parseInt(schema.stock);
                        productFound.stock = productFound.stock + schema.stock;
                        if(productFound.stock>= 0){
                            productModel.findByIdAndUpdate(idProduct,productFound, {new: true, useFindAndModify: false}, (err, productUpdate)=>{
                                if(err){
                                    jsonResponse.message = "error al editar producto";
                                    
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
                                        jsonResponse.message = "no se encontro el producto";
                    
                                        res.status(jsonResponse.error).send(jsonResponse);
                                    }
                                }
                                statusClean();
                            });
                        }else{
                            jsonResponse.error = 400;
                            jsonResponse.message = "cantidad invalida con la bodega";
                    
                            res.status(jsonResponse.error).send(jsonResponse);
                            statusClean();
                        }  
                    }
                }
            })
        }else{
            jsonResponse.error = 400;
            jsonResponse.message = "llene los campos obligatorios";

            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        }
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
            params.stock.length > 0 &&
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
                            if(productFound.stock >=schema.stock){
                                
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

function changes(req,res){
    
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
                            if(productFounds.stock >= schema.stock){
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

function change(req,res){
    statusClean();
    var params = req.body;
    var datatoken = req.user;
    var idProduct = req.params.idProduct
    //all vars in use
    
    
    var schema = {};
    
    params.stock?schema.stock = params.stock:null;

    datatoken && datatoken.rolUser == "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;

    
    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idPlace:null;

    if(datatoken.rolUser == "admin" || datatoken.rolUser == "company"){
        if(params.stock){
            productModel.findById(idProduct,(err,productFound)=>{
                if(err){
                    jsonResponse.message = "No se pudo registrar el producto"
                                                                        
                                                                    
                    res.status(jsonResponse.error).send(jsonResponse);
                    statusClean();
                }else{
                    if(productFound){
                        productModel.findOne({$and:[
                            {idCompany: productFound.idCompany},
                            {nameProduct: productFound.nameProduct},
                            {nameProvedor: productFound.nameProvedor},
                            {idDestiny: productFound.idCompany},
                        ]},(err,productFounds)=>{
                            if(err){
                                jsonResponse.message = "No se pudo registrar el producto"
                                                                        
                                                                    
                                res.status(jsonResponse.error).send(jsonResponse);
                                statusClean();
                            }else{
                                if(productFounds){
                                    if(productFounds.stock >= schema.stock){
                                        productFound.stock = parseInt(productFound.stock)
                                        schema.stock = parseInt(schema.stock)
                                        productFound.stock = productFound.stock + schema.stock
                                        if(productFound.stock >= 0){
                                            schema.stock = productFounds.stock - schema.stock
                                            productModel.findByIdAndUpdate(productFounds._id,
                                                schema,{new: true, useFindAndModify:false},
                                                (err,productUpdate)=>{
                                                    if(err){
                                                        jsonResponse.message = "No se pudo registrar el producto"
                                                                        
                                                                    
                                                        res.status(jsonResponse.error).send(jsonResponse);
                                                        statusClean();
                                                    }else{
                                                        if(productUpdate){
                                                            productModel.findByIdAndUpdate(idProduct,
                                                                productFound,{new: true, useFindAndModify: false},
                                                                (err,productUpdate)=>{
                                                                    if(err){
                                                                        
                                                                        jsonResponse.message = "No se pudo registrar el producto"
                                                                        
                                                                    
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
                                                                            jsonResponse.error = 400;
                                                                            jsonResponse.message = "No se pudo editar el producto"
                                                                            
                                                                        
                                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                                            statusClean();
                                                                        }
                                                                    }
                                                                })
                                                        }else{
                                                            jsonResponse.error = 404;
                                                            jsonResponse.message = "No se pudo editar el producto"
                                                            
                                                        
                                                            res.status(jsonResponse.error).send(jsonResponse);
                                                            statusClean();
                                                        }
                                                    }
                                                })
                                        }else{
                                            jsonResponse.error = 400;
                                            jsonResponse.message = "error, cantidad de producto menor a la existente"
                                            
                                        
                                            res.status(jsonResponse.error).send(jsonResponse);
                                            statusClean();
                                        }
                                                
                                    }else{
                                        jsonResponse.error = 400;
                                        jsonResponse.message = "error, cantidad de producto menor a la existente en bodega"
                                        
                                    
                                        res.status(jsonResponse.error).send(jsonResponse);
                                        statusClean();

                                    }
                                }else{
                                    jsonResponse.error = 404;
                                    jsonResponse.message = "No se encontro el producto"
                                    
                                    res.status(jsonResponse.error).send(jsonResponse);
                                    statusClean();
                                }
                            }
                        })
                    }else{
                        jsonResponse.error = 404;
                        jsonResponse.message = "No se encontro el producto"
                        
                        res.status(jsonResponse.error).send(jsonResponse);
                        statusClean();
                    }
                }
            })
        }else{
            jsonResponse.error = 400;
            jsonResponse.message = "llene todos los parametros obligatorios"
            
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        }
    }else{
        jsonResponse.error = 403;
        jsonResponse.message = "no posees los permisos necesarios"
        
        res.status(jsonResponse.error).send(jsonResponse);
        statusClean();
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\

function deleter(req,res){

    statusClean();
    
    var idProduct = req.params.idProduct;
    var datatoken = req.user;
    var params = req.body;
    
    //all vars in use
    var schema = {};

    productModel.findById(idProduct,(err,productFound)=>{
        if(err){
            jsonResponse.error = 403;
            jsonResponse.message = "no posees los permisos necesarios";
            res.status(jsonResponse.error).send(jsonResponse);
            statusClean();
        }else{
            if(productFound){
                productModel.findOne({$and:[
                    {idCompany: productFound.idCompany},
                    {nameProduct: productFound.nameProduct},
                    {nameProvedor: productFound.nameProvedor},
                    {idDestiny: productFound.idCompany},
                ]},(err,productFounds)=>{
                    if(err){

                    }else{
                        if(productFounds){
                            productFounds.stock = parseInt(productFounds.stock);
                            productFound.stock = parseInt(productFound.stock);
                            schema.stock = productFounds.stock + productFound.stock;
                            productModel.findOneAndUpdate({$and:[
                                {idCompany: productFound.idCompany},
                                {nameProduct: productFound.nameProduct},
                                {nameProvedor: productFound.nameProvedor},
                                {idDestiny: productFound.idCompany},
                            ]},schema,{new: true, useFindAndModify: false}, (err, productUpdate)=>{
                                if(err){

                                }else{
                                    if(productUpdate){
                                        productModel.findByIdAndDelete(idProduct,(err,productDelete)=>{
                                            if(err){

                                            }else{
                                                if(productDelete){
                                                    schema.stock = productDelete.stock
                                                    console.log(schema)
                                                    jsonResponse.error = 200;
                                                    jsonResponse.message = "producto eliminada!!"
                                                }else{

                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }else{
                            productModel.findByIdAndDelete(idProduct,(err,productDelete)=>{
                                if(err){

                                }else{
                                    if(productDelete){
                                        schema.stock = productDelete.stock
                                        console.log(schema)
                                        jsonResponse.error = 200;
                                        jsonResponse.message = "producto eliminada!!"
                                    }else{

                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })

    params.nameProduct?schema.nameProduct = params.nameProduct:null;
    params.nameProvedor?schema.nameProvedor = params.nameProvedor:null;
    params.stock?schema.stock = params.stock:null;
    params.sale?schema.sale = params.sale:null;
    params.idDestiny?schema.idDestiny = params.idDestiny:null;

    datatoken && datatoken.rolUser == "admin"?params.idCompany?schema.idCompany = params.idCompany:null:null;

    
    datatoken && datatoken.rolUser == "company"?schema.idCompany = datatoken.idPlace:null;


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
    deleter,

}