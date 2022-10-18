const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');

//verification si utilisateur connecté
// next pour poursuivre le code
module.exports.checkUser = (req, res, next) => {
    
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.CLE_SECRETE, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge: 1 })
                next();
            } else {
                console.log('decoded token ' + decodedToken.id);
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                console.log(user);
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}


// Si une authentification est requise
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.CLE_SECRETE, async (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        })
    } else {
        console.log('Pas de token');
    }
}
