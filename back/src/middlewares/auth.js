class Auth{

    createToken(user){
        var jwt = require("jwt-simple");
        var moment = require("moment");
        var secret = "secret_password";

        var payload = {
            _id: user._id,
            idPlace: user.idPlace,
            nameUser: user.nameUser,
            lastnameUser: user.lastnameUser,
            nickUser: user.nickUser,
            emailUser: user.emailUser,
            passwordUser: user.passwordUser,
            rolUser: user.rolUser,
            iat: moment().unix(),
            exp: moment().day(10, "days").unix()
        };

        return jwt.encode(payload, secret); 
    }

    ensureAuth(req, res, next){
        var jwt = require("jwt-simple");
        var moment = require("moment");
        var secret = "secret_password";
        var token = null;
        var payload = null;

        if(!req.headers.authorization){
            return res.status(404).send({message: "La peticion no tiene la cabecera en la autenticacion"});
        }else{
            try{
                token = req.headers.authorization.replace(/['"]+/g, "");
                payload = jwt.decode(token, secret);

                if(payload.exp <= moment().unix()){
                    return res.status(404).send({message: "el token ha expirado"});
                }else{
                    req.user = payload;
                    next();
                }
            }catch(error){
                return res.status(404).send({message: "el token no es valido"});
            }
        }
    }

    ensureAuthOptional(req, res, next){
        var jwt = require("jwt-simple");
        var moment = require("moment");
        var secret = "secret_password";
        var token = null;
        var payload = null;

        
        try{
            token = req.headers.authorization.replace(/['"]+/g, "");
            payload = jwt.decode(token, secret);
            if(payload.exp <= moment().unix()){
                return res.status(404).send({message: "el token ha expirado"});
            }
        }catch(error){}

        req.user = payload;
        next();
    }
}

module.exports = Auth;