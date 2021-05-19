const db = require("../models");
const User = db.user;
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const config = require("./../config/config.json");

exports.login = async(req, res) => {
    var _user = req.body.user;
    //  console.log(req.body.user)
    if (req.body.user) {


        var chekIsUserExist = await User.findOne({ email: _user.email });

        if (chekIsUserExist) {
            const hashedPassword = crypto
                .pbkdf2Sync(
                    req.body.user.password,
                    chekIsUserExist.salt,
                    10000,
                    256,
                    "sha512"
                )
                .toString("base64");
            if (hashedPassword === chekIsUserExist.hash) {
                const _payload = {
                    email: chekIsUserExist.email,
                    id: chekIsUserExist.id,
                    image: chekIsUserExist.image,
                    username: chekIsUserExist.username,
                    role: chekIsUserExist.role
                };


                const token = jsonwebtoken.sign(_payload, config.secret, {
                    expiresIn: config.tokenLife,
                });
                const refreshtoken = jsonwebtoken.sign(
                    _payload,
                    config.refreshTokenSecret, { expiresIn: config.refreshTokenLife }
                );

                chekIsUserExist.token = token
                chekIsUserExist.refreshtoken = refreshtoken
                chekIsUserExist.save().then(() => {
                        res.send({
                            sucess: true,
                            status: "ok",
                            message: "sucess",
                            token: token,
                            refreshtoken: refreshtoken,
                            user: _payload,
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while login."
                        });
                    })

            } else {
                res.send({
                    sucess: false,
                    status: "failed",
                    message: "incorrect password",
                });
            }

        } else {
            res.send({
                sucess: false,
                status: "failed",
                message: "user not found",
            });
        }
    } else {
        res.send({
            sucess: false,
            status: "failed",
            message: "not a valid user need user email",
        });
    }
};

exports.getrefreshtoken = async(req, res) => {

    console.log('8888888')


    const refreshtoken = extractrefreshtoken(req);
    const token = extractToken(req);
    const Proxytoken = extractToken(req);

    const dbtoken = await User.findOne(

            { $and: [{ token: token }, { refreshtoken: refreshtoken }] }
        )
        //  console.log(dbtoken, 'dbtoken')
    console.log(dbtoken, "checkingtoken");
    if (dbtoken) {




        try {
            const decoded = jsonwebtoken.verify(Proxytoken, config.secret);


            //  console.log(decoded)

        } catch (e) {
            /*if invalid token */
            console.error(e);
            res.status(500).send({ sucess: false, ...e });
        }



        const decoded = jsonwebtoken.verify(Proxytoken, config.secret);



        //  console.log(decoded.email, "decoded.email");

        const _payload = {
            email: dbtoken.email,
            id: dbtoken._id,
            image: dbtoken.image,
            username: dbtoken.username
        };


        console.log(_payload, '_payload')

        const token = jsonwebtoken.sign(_payload, config.secret, {
            expiresIn: config.tokenLife,
        });
        const refreshtoken = jsonwebtoken.sign(
            _payload,
            config.refreshTokenSecret, { expiresIn: config.refreshTokenLife }
        );



        dbtoken.token = token
        dbtoken.refreshtoken = refreshtoken
        dbtoken.save().then(() => {

                res.send({
                    sucess: true,
                    status: "ok",
                    message: "sucess",
                    token: token,
                    refreshtoken: refreshtoken
                        // userdata,
                });



            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while generating token."
                });
            })




    } else {
        res.send({
            sucess: false,
            status: "failed",
            message: "Invalid request",
        });
    }





}

exports.forGetPassword = async(req, res) => {

    console.log(req.query.email, "email");
    const Dbuser = await User.findOne({ email: req.query.email })

    if (Dbuser) {
        var token = (Dbuser.resetPasswordToken = crypto
            .randomBytes(60)
            .toString("hex"));
        Dbuser.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
        //  Dbuser.resetPasswordExpires = Date.now()

        Dbuser.passwordResetToken = token

        Dbuser.save().then(() => {
            res.send({
                sucess: true,
                status: "ok",
                message: "sucess",
                passwordResetToken: token,
            });

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while gerating forget password token."
            });
        })


    } else {
        res.json({
            sucess: false,
            status: "failed",
            message: "user not found",
        });
    }

}

exports.resetpassword = async(req, res) => {
    console.log(req.body);

    var d = Date.now();
    console.log(d);
    const Dbuser = await User.findOne({ $and: [{ email: req.body.email }, { passwordResetToken: req.body.passwordResetToken }] })

    // istoken = users.find(
    //     ({ resetPasswordToken }) => resetPasswordToken === req.body.token
    // );


    console.log(Dbuser, 'dbuser')

    if (Dbuser) {

        if (d < Dbuser.resetPasswordExpires) {

            Dbuser.salt = crypto.randomBytes(64).toString("hex");
            Dbuser.hash = crypto
                .pbkdf2Sync(req.body.newpassword, Dbuser.salt, 10000, 256, "sha512")
                .toString("base64");


            Dbuser.resetPasswordExpires = null
            Dbuser.passwordResetToken = null

            Dbuser.save().then(() => {




                res.json({
                    sucess: true,
                    message: "password changed",
                });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while gerating forget password token."
                });
            })


        } else {
            res.json({
                sucess: false,
                status: "failed",
                message: "time out token expired",
            });



        }





    } else {
        res.json({
            sucess: false,
            status: "failed",
            message: "token expired or notfound",
        });
    }

}

exports.profile = async(req, res) => {
    var token = extractToken(req);
    console.log(token);


    const decoded = jsonwebtoken.verify(
        token,
        config.secret,
        async function(err, decoded) {
            if (err) {
                res.send({
                    err,
                });
            } else {
                const decodeddata = jsonwebtoken.verify(token, config.secret);
                if (decodeddata) {
                    const me = decodeddata;

                    const Dbuser = await User.findOne({ email: decoded.email });

                    res.send({
                        sucess: true,
                        status: "ok",
                        message: "user data",
                        profile: me,
                        token: token,
                        role: Dbuser.role
                    });
                }
            }
        }
    );

}


function extractrefreshtoken(req) {
    if (req.headers.refreshtoken) {
        return req.headers.refreshtoken;
    } else {
        return null;
    }
}

function extractToken(req) {
    if (


        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        // console.log(req.headers.authorization.split(" ")[1], ']]]]]]')
        return req.headers.authorization.split(" ")[1];
    } else if ((req.query && req.query.token) || req.headers.token) {
        return req.query.token || req.headers.token;
    }
    return null;
}