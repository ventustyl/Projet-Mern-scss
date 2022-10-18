// --- Inscription Connection Deconnection ---

// Appel du schema
const UserModel = require("../models/user.model.js");

// Appel de JWT
const jwt = require("jsonwebtoken");

//import la fonction outils des erreurs
const { signUpErrors, signInErrors } = require("../outils/errors.outils.js");

// Durée de vie de du token 3J
const ageMax = 3 * 24 * 60 * 60 * 1000;

// Creation du token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.CLE_SECRETE, {
    // la clé secrete expire au bout 3 jours en ms
    expiresIn: ageMax,
  });
};

// Module d'inscription
module.exports.signUp = async (req, res) => {
  console.log(req.body);
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).send({ errors });
  }
};

// Module pour se connecter
module.exports.signIn = async (req, res) => {
  console.log(req.body);
  // Info demandé pour la connexion email et password
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    //parametre envoyé au cookie (le nom, le token, les caracteristiques consultable uniquement par le serveur)
    res.cookie("jwt", token, { httpOnly: true, maxAge: ageMax });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(200).send(errors);
  }
};

// Module pour la déconnection
module.exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
