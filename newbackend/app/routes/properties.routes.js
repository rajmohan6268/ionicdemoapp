module.exports = (app) => {
    const properties = require("../controllers/properties.controller");

    const auth = require("../middleware/auth");
    var router = require("express").Router();

    //auth
    router.get("/", properties.getProperties);

    router.post("/", auth, properties.AddProperties);



    app.use("/api/properties", router);





};
