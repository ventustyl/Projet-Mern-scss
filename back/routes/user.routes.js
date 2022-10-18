const router = require('express').Router();


// route des controllers
const authController = require ('../controllers/auth.controller.js');
const userController = require ('../controllers/user.controller.js');
const uploadController = require ('../controllers/upload.controller.js');


// Pour aller sur localhost/api/user/register s'inscrire
router.post('/register', authController.signUp);
// // Pour se log sur le site
router.post('/login', authController.signIn);
// // Pour la déconnexion
router.get('/logout', authController.logout);


//  --- User DB ---
router.get('/', userController.getAllusers);
// // quand dans notre chemin on a un parametre id on prend les infos de l'utalisateur en question
router.get('/:id', userController.userInfo);
// // pour update avec le put depuis le controller user
router.put("/:id", userController.updateUser );
// // pour supprimer l'utilisateur
router.delete("/:id", userController.deleteUser);
// // Pour le follow avec l'id dans le tableau 
router.patch('/follow/:id', userController.follow);
// // Pour le unfollow avec l'id dans le tableau 
router.patch('/unfollow/:id', userController.unfollow);

// // upload
 router.post("/upload", uploadController.uploadProfil);

module.exports = router;