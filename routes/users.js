//==============================DEFINITION===============================//
const express = require("express");
const router = express.Router({ mergeParams: true });

//============================IMPORT MODULES============================//
//==========IMPORT MODELS==========//
const User = require("../models/user");
//============================IMPORT Controllers============================//
const users = require("../controllers/users");
//===========================middleware============================//
const { checkReturnTo } = require("../middleware");

/***********************************************************************/
/***********************************************************************/
router
    .route("/register")
    .get(users.renderRegisterForm) //===R:Register Form ===//
    .post(users.registerUser); //=====C:Register New User ====//

router
    .route("/login")
    .get(users.renderLoginForm) //====R:Login Form =======//
    .post(checkReturnTo, users.loginAuth, users.login); //=====POST:Login Authentication ====//

//==================GET:Logout Authentication =======================//
router.get("/logout", users.logout);
/*****************************************************************/
module.exports = router;
/*****************************************************************/

