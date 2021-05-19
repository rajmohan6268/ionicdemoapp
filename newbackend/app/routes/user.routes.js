module.exports = (app) => {
    const user = require("../controllers/user.controller.js");
    const auth = require("../controllers/auth.controller.js");

    var router = require("express").Router();



    router.get("/me", auth.profile);

    router.post("/signup", user.addUser);
    router.post("/login", auth.login);
    router.get("/refreshtoken", auth.getrefreshtoken);

    router.get("/forGetPassword", auth.forGetPassword);

    router.post("/resetpassword");

    app.use("/api/users", router);


    router.get("/getAllUsers", user.getuser);
    router.get("/user/:id", user.getById);


};