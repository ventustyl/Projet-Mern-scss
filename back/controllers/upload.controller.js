// Appel du schema
const UserModel = require("../models/user.model.js");
const { uploadErrors } = require("../outils/errors.outils.js");

// import l'image de profil
module.exports.uploadProfil = async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        message: "No file uploaded",
      });
    } else if (
      // Validation du format d'image (*.jpg, *png, *.jpeg)
      req.files.avatar.mimetype !== "image/jpg" &&
      req.files.avatar.mimetype !== "image/png" &&
      req.files.avatar.mimetype !== "image/jpeg"
    ) {
      throw Error("invalid file");
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
      // Validation de la limite de la taille d'image
    } else if (req.files.avatar.size > 1000000) {
      throw Error("max size");
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    } else {
      //Utilisez le nom du champ de saisie (c'est-à-dire "avatar") pour récupérer le fichier téléchargé
      let avatar = req.files.avatar;
      //Utilisez la méthode mv() pour placer le fichier dans le répertoire de téléchargement (c'est-à-dire "uploads")
      avatar.mv("../image/profil/" + avatar.name);

      UserModel.findByIdAndUpdate(
        req.body.userId,
        { $set: { picture: "../image/profil/" + avatar.name } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, docs) => {
          if (!err)
            //send response
            res.send({
              status: true,
              message: "File is uploaded",
              data: {
                name: avatar.name,
                mimetype: avatar.mimetype,
                size: avatar.size,
              },
            });
        }
      );
    }
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
};
