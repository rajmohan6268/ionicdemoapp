const db = require("../models");
const User = db.user;
const crypto = require("crypto");

exports.getuser = async(req, res) => {
    User.find()
        .then((data) => {
            res.send({
                sucess: true,
                users: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users.",
            });
        });
};

exports.getById = async(req, res) => {
    const id = req.params.id;

    User.findById(id)
        .then((data) => {
            if (!data)
                res
                .status(404)
                .send({ sucess: false, message: "Not found user with id " + id });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                sucess: false,
                message: "Error retrieving user with id=" + id,
            });
        });
};

exports.addUser = async(req, res) => {
    var _user = req.body.user;
    // console.log(_user);
    if (!_user.image) {
        _user.image = "https://nanoguard.in/wp-content/uploads/2019/09/pic.jpg";
    }

    if (_user.email && _user.username && _user.password) {
        var chekIsUserExist = await User.findOne({ email: _user.email })

        console.log(chekIsUserExist, 'chekIsUserExist')

        if (chekIsUserExist === null) {
            _user.salt = crypto.randomBytes(64).toString("hex");
            _user.hash = crypto
                .pbkdf2Sync(req.body.user.password, _user.salt, 10000, 256, "sha512")
                .toString("base64");

            const user = new User({
                email: _user.email,
                username: _user.username,
                image: _user.image,
                salt: _user.salt,
                hash: _user.hash,
                role: _user.role
            });

            user
                .save(user)
                .then((data) => {
                    res.json({
                        sucess: true,
                        status: "ok",
                        message: "user created",
                        user,
                    });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Tutorial.",
                    });
                });
        } else {
            res.send({
                sucess: false,
                status: "failed",
                message: `${_user.email} already exist `,
            });
        }
    } else {
        res.send({
            sucess: false,
            status: "failed",
            message: " in valid data  email,username,password, required",
            chekIsUserExist
        });
    }
};

exports.create = async(req, res) => {
    console.log(req.body);

    if (!req.body.user) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a user
    const user = new User({
        email: req.body.user.email,
        password: req.body.user.password,
    });

    // Save user in the database
    user
        .save(user)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user.",
            });
        });
};