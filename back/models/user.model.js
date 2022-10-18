//Appel du middleware mongoose
const mongoose = require('mongoose');

//Appel du middleware validator de la fonction isEmail à la place de REGEX
const { isEmail } = require('validator');

//Appel du middleware bcrypt
const bcrypt = require('bcrypt');

// Schema mangoose 
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      // Un seul pseudo
      unique: true,
      // retire les espaces
      trim: true
    },
    email: {
      type: String,
      required: true,
      // depuis le middleware validator pour verifié l'email
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio :{
      type: String,
      max: 1024,
    },
    followers: {
        //tableau des utilisateurs qui nous suivent avec des ID
      type: [String]
    },
    following: {
               //tableau des utilisateurs suivis avec des ID
      type: [String]
    },
    likes: {
        // J'aime avec id du post
      type: [String]
    }
  },
  {
    timestamps: true,
  }
);

//Cryptage du mot de passe 

//Avant de sauvegarder la requete on fait pre et fonction async
userSchema.pre("save", async function(next) {
    
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


//On désale le mot de passe lors de l'authentification
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    // Bcrypt compare les deux cryptages
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};


// Table User dans mangoose avec le schema userSchema
const UserModel = mongoose.model("user", userSchema);

//export de UserModel
module.exports = UserModel;