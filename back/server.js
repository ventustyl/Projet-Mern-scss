// Appel de express
const express = require('express');

// Appel de mongoose pour la base de donnée
const mongoose = require ('mongoose') ;

//Appel de dotenv pour les variable d'environnement
require('dotenv').config({ path: './config/.env' })

//Appel de cookie-parser
const cookieParser = require('cookie-parser');

//Verification d'utilisateur
const { checkUser, requireAuth } = require('./middleware/auth.middleware.js')

// Appel de cors pour les requetes
const cors = require ('cors')

//Appel de fileUpload
const fileUpload = require('express-fileupload');

const app = express();

// Appel de routes
const userRoutes = require('./routes/user.routes.js');
const postRoutes = require('./routes/post.routes.js');

// Cors Option avec l'ensemble des paramètres de securité 
const corsOption = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOption))


// Body parser inclu dans express
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // Pour analyser les requêtes entrantes avec JSON

// Utilisation de file upload
app.use(fileUpload({
  
  }));
  app.use(express.static('uploads'));

//Pour lire le cookie
app.use(cookieParser())

//jwt il se déclenche sur tous les GET pour voir que l'utilisateur a bien les autorisations pour aller sur les pages (Sécurité)
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
})

// routes pour les utilisateurs et les posts
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes)


// Connexion à la base de données Mongodb
mongoose
    .connect('mongodb+srv://'+ process.env.LOG +'@cluster0.zj87sas.mongodb.net/projet-final',
    )
  .then(
    () =>
      // Port d'écoute pour le back
      app.listen(process.env.PORT, () =>
        console.log(`Connexion Reussi  & Ecoute localhost Port ${process.env.PORT})`)
      )
    // Si echec console log erreur
  )
  .catch((err) => console.log(err));





// ------------------------------------------------------------------//
// MongoDB                                                           //
// Pseudo : Noxy                                                     //
// Mot de passe : fcilteam                                           //
// Mongo Atlas                                                       //
// mongodb+srv://Noxy:fcilteam@cluster0.zj87sas.mongodb.net/test     //
// ------------------------------------------------------------------//
