// Verification pour l'enregistrement de l'utilisateur
  module.exports.signUpErrors = (err) => {
    // on initialise la variable errors
    let errors = {
      pseudo: "",
      email: "",
      password: "",
    };
  
    if (err.message.includes("pseudo"))
      errors.pseudo = "Pseudo incorrect ou déjà pris";
  
    if (err.message.includes("email")) errors.email = "Email incorrect";
  
    if (err.message.includes("password"))
      errors.password = "Mot de passe trop court 6 caractères minimum";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
      errors.pseudo = "Cet pseudo est déjà pris";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Cet email est déjà pris";
  
    return errors;
  };
  

  //Verification pour la connection si email ou mot de passe connu
  module.exports.signInErrors = (err) => {
    // on initialise la variable errors
    let errors = {
      email: "",
      password: "",
    };
  
    if (err.message.includes("email")) errors.email = "Email inconnu";
  
    if (err.message.includes("password"))
      errors.password = "Mot de passe inconnu";
  
    return errors;
  };
    
  
  // retour d'erreur d'upload
  module.exports.uploadErrors = (err) => {
    let errors = { format: "", maxSize: "" };
  
    if (err.message.includes("invalid file"))
      errors.format = "Format incompatible";
  
    if (err.message.includes("max size"))
      errors.maxSize = "le fichier dépasse 1Mo";
  
      return errors
  };
  