
// Appel du schema
const UserModel = require('../models/user.model.js');

// Creation d'un objetID depuis mongoose
const ObjetID = require('mongoose').Types.ObjectId;

//  --- Toutes les fonctions sont appelés depuis user.routes.js ----
//  --- Le CRUD ---

// renvoi tous les utilisateurs 
module.exports.getAllusers = async (req, res) => {
    //on retire le parametre password de la requete GET et on retire le mot de passe meme si il est hash
    const users = await UserModel.find().select('-password');
    //status 200 tout va bien
    res.status(200).json(users);
}

// info de un utilisateur
module.exports.userInfo = (req, res) => {
    // req.params est l'id passé apres l'URL
    if (!ObjetID.isValid(req.params.id))
        return res.status(400).send('ID inconnue: ' + req.params.id)

    UserModel.findById(req.params.id, (err, data) => {
        if (!err) res.send(data);
        else console.log('ID inconnue: ' + err)
        // Toujours retirer le mot de passe 
    }).select('-password');
}

//Pour la mise à jour
module.exports.updateUser = async (req, res) => {
    // req.params est l'id passé apres l'URL est connu
    if (!ObjetID.isValid(req.params.id))
        return res.status(400).send('ID inconnue: ' + req.params.id)
    try {
        // trouve l'id et le met à jour   
        UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                //Met en place avec le $set, il le crée si il n'existe pas 
                $set: { bio: req.body.bio },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, data) => {
                if (!err) res.send(data);
                if (err) return res.status(500).send({ message: err });
            })
    } catch (err) {
        return res.status(500).json({ message: err });

    }
};

//module de suppression d'utilisateur
module.exports.deleteUser = async (req, res) => {
    // req.params est l'id passé apres l'URL est connu
    if (!ObjetID.isValid(req.params.id))
        return res.status(400).send('ID inconnue: ' + req.params.id)
    try {
        await UserModel.deleteMany({ _id: req.params.id }).exec()
        res.status(200).json({ message: "Utilisateur supprimé" })
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

//module follow
module.exports.follow = async (req, res) => {
    // req.params est l'id passé apres l'URL est connu
    if (!ObjetID.isValid(req.params.id) || !ObjetID.isValid(req.body.idToFollow))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        // Qui on suit ? Following
        UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).jsos(err);
            }
        );
        // Qui nous suit ? Followers
        UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                // On ne peut pas renvoyer deux fois le status (201)
                if (err) return res.status(400).jsos(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

//module unfollow
module.exports.unfollow = async (req, res) => {
    // req.params est l'id passé apres l'URL est connu 
    if (!ObjetID.isValid(req.params.id) || !ObjetID.isValid(req.body.idToUnfollow))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        // Qui on ne suit plus ? unFollow
        UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).jsos(err);
            }
        );
        // Qui nous suit plus ? unFollowers
        UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                // On ne peut pas renvoyer deux fois le status (201)
                if (err) return res.status(400).jsos(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};