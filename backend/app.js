const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
const auth = require("./middleware/auth");
const config = require("./config");
const users = [{
        id: 1,
        image: "https://nanoguard.in/wp-content/uploads/2019/09/pic.jpg",
        email: "",
        username: "",
        hash: "",
        token: "",
        salt: "",
        firstName: "",
        lastName: "",
    },
    {
        id: 2,
        image: "https://nanoguard.in/wp-content/uploads/2019/09/pic.jpg",
        email: "",
        username: "",
        hash: "",
        token: "",
        salt: "",
        firstName: "",
        lastName: "",
    },
    {
        image: "https://nanoguard.in/wp-content/uploads/2019/09/pic.jpg",
        email: "test@gmail.com",
        username: "test",
        password: "test",
        firstName: "test",
        lastName: "test",
        id: 3,
        salt: "61dbe5f855a2faf9954122149ce34695538aa5fd657e36b72cfd599bc96d0b256fd7689c2baf38295f7a8b8a511f0512c5f021e6fdf4e63dc6eb9af04e7c45c2",
        hash: "W,tXFaTcmkuHCIxMJ2Z/f0IEylWx9a2BSCwETzNs2aeAvz+WB7SaSCr/zlf8ssO2jKwh50XAS7AcBKs4SjosHQttytLw+ck6igbqbZsoQnpMSffhH4kkyMW/s8kLADupo8B7AjPv0iYXlInjBj5P53ytYMxeLOCMNCImmhf1Lk7qB8PeSgK3TthbOXbJZYi6VCwZKOiBXReHqaPq8m4Co+mxP4s5+mdlhc0SaMxUCEHVc1sPrK+h0y7mRGn4SgM5kovjP8qeRLu7T5lniwIIBBDeS74/ljd6pq7xC3kexDx5r5i3w4Rkqn3PfgtuFpmLYyic+UjlLvX0Q0Qs0S8g8LA==",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWQiOjMsImltYWdlIjoiaHR0cHM6Ly9uYW5vZ3VhcmQuaW4vd3AtY29udGVudC91cGxvYWRzLzIwMTkvMDkvcGljLmpwZyIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJpYXQiOjE2MjA3NDU2MDgsImV4cCI6MTYyMDgzMjAwOH0.tnxgGEWpSCyeb8EIu_wFsJkPEsW5G4D6bhymhR8q3C8",
    },
];
const tokenList = [];
app.get("/", async(req, res) => {
    res.send({
        sucess: true,
        status: "ok",
    });
});

app.get("/users", async(req, res) => {
    res.send({
        sucess: true,
        status: "ok",
        users: users,
        tokenList,
    });
});

app.get("/users/:id", async(req, res) => {
    console.log(req.params.id);

    var reqid = req.params.id;

    const result = users[reqid - 1];

    res.send({
        sucess: true,
        status: "ok",
        users: result,
    });
});

app.post("/signup", async(req, res) => {
    var _user = req.body.user;
    console.log(_user);

    id = users.length + 1;
    var tempUser = {
        ..._user,
        id: id,
        image: "https://nanoguard.in/wp-content/uploads/2019/09/pic.jpg",
    };

    if (
        _user.email &&
        _user.username &&
        _user.password &&
        _user.firstName &&
        _user.lastName
    ) {
        var dbUser = checkAvailability(users, _user.email);

        if (dbUser) {
            res.send({
                sucess: false,
                status: "failed",
                message: `${_user.email} already exist `,
            });
        } else {


            tempUser.salt = crypto.randomBytes(64).toString("hex");
            tempUser.hash = crypto
                .pbkdf2Sync(req.body.user.password, tempUser.salt, 10000, 256, "sha512")
                .toString("base64");

            users.push(tempUser);

            // delete tempUser.salt,
            //     delete tempUser.password,
            //     delete tempUser.hash

            user = {
                id: tempUser.id,
                email: tempUser.email,
                firstName: tempUser.firstName,
                lastName: tempUser.lastName,
            };

            res.send({
                sucess: true,
                status: "ok",
                message: "user created",
                user,
            });



        }
    } else {
        res.send({
            sucess: false,
            status: "failed",
            message: " in valid data  email,username,password,firstname,lastname required",
        });
    }
});




app.post("/login", async(req, res) => {

    console.log(req.body, 'atempting login')
    const Dbuser = users.find(({ email }) => email === req.body.user.email);

    if (Dbuser) {



        const hashedPassword = crypto
            .pbkdf2Sync(req.body.user.password, Dbuser.salt, 10000, 256, "sha512")
            .toString("base64");

        if (hashedPassword === Dbuser.hash) {
            const _payload = {
                email: Dbuser.email,
                id: Dbuser.id,
                image: Dbuser.image,

                firstName: Dbuser.firstName,
                lastName: Dbuser.lastName,
            };
            const token = jsonwebtoken.sign(_payload, config.secret, {
                expiresIn: config.tokenLife,
            });
            const refreshtoken = jsonwebtoken.sign(
                _payload,
                config.refreshTokenSecret, { expiresIn: config.refreshTokenLife }
            );

            Dbuser.token = token;

            const tokenAndrefreshtokenCopy = {
                status: "Logged in",
                token: token,
                refreshtoken: refreshtoken,
            };

            tokenList.push(tokenAndrefreshtokenCopy);
            res.send({
                sucess: true,
                status: "ok",
                message: "sucess",
                token: token,
                refreshtoken: refreshtoken,
                user: _payload,
            });
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
});

app.get("/recover", async(req, res) => {
    console.log(req.query.email, "email");
    const Dbuser = users.find(({ email }) => email === req.query.email);

    if (Dbuser) {
        var token = (Dbuser.resetPasswordToken = crypto
            .randomBytes(60)
            .toString("hex"));
        Dbuser.resetPasswordExpires = Date.now() + 3600000; //expires in an hour

        res.send({
            sucess: true,
            status: "ok",
            message: "sucess",
            passwordResetToken: token,
        });
    } else {
        res.json({
            sucess: false,
            status: "failed",
            message: "user not found",
        });
    }
});

app.post("/resetpassword", async(req, res) => {
    console.log(req.body);

    var d = Date.now();
    console.log(d);
    const Dbuser = users.find(({ email }) => email === req.body.email);

    istoken = users.find(
        ({ resetPasswordToken }) => resetPasswordToken === req.body.token
    );

    // if (d < Dbuser.resetPasswordExpires) {
    if (Dbuser) {
        if (istoken) {
            Dbuser.salt = crypto.randomBytes(64).toString("hex");
            Dbuser.hash = crypto
                .pbkdf2Sync(req.body.newpassword, Dbuser.salt, 10000, 256, "sha512")
                .toString("base64");

            res.json({
                sucess: true,
                message: "password changed",
            });
        } else {
            res.json({
                sucess: false,
                status: "failed",
                message: "token not found",
            });
        }
    } else {
        res.json({
            sucess: false,
            status: "failed",
            message: "token expired found",
        });
    }
});




app.use(auth);

app.get("/refreshtoken", async(req, res) => {
    //  const info = req.header.Authorization;
    const refreshtoken = extractrefreshtoken(req);

    const token = extractToken(req);
    const chcktokn = extractToken(req);
    //   console.log(token, '////', refreshtoken, '//////////')

    // res.send(tokenList)

    const checkingtoken = checkAvailabilityrefreshtoen(tokenList, refreshtoken);

    console.log(checkingtoken, "checkingtoken");
    if (token && checkingtoken) {
        //  console.log("())))))))))))))))");


        const decoded = jsonwebtoken.verify(chcktokn, config.secret);

        console.log(decoded.email, "decoded.email");

        var userdata = users.some((arrVal) => {
            arrVal.email === decoded.email;
        });

        console.log(userdata, "[[userdata]]");
        const _payload = {
            email: decoded.email,
            id: decoded.id,
            image: decoded.image,

            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };

        console.log(userdata, "userdatauserdatauserdatauserdatauserdata");

        const token = jsonwebtoken.sign(_payload, config.secret, {
            expiresIn: config.tokenLife,
        });
        const refreshtoken = jsonwebtoken.sign(
            _payload,
            config.refreshTokenSecret, { expiresIn: config.refreshTokenLife }
        );

        // tokenList[tokenAndrefreshtokenCopy.refreshtoken].token = token;

        const tokenAndrefreshtokenCopy = {
            status: "Logged in",
            token: token,
            refreshtoken: refreshtoken,
        };

        tokenList.push(tokenAndrefreshtokenCopy);
        res.send({
            sucess: true,
            status: "ok",
            message: "sucess",
            token: token,
            refreshtoken: refreshtoken,
            userdata,
        });



    } else {
        res.send({
            sucess: false,
            status: "failed",
            message: "Invalid request",
        });
    }
});

app.get("/me", async(req, res) => {
    var token = extractToken(req);
    console.log(token);

    const decoded = jsonwebtoken.verify(
        token,
        config.secret,
        function(err, decoded) {
            if (err) {
                res.send({
                    err,
                });
            } else {
                const decodeddata = jsonwebtoken.verify(token, config.secret);
                if (decodeddata) {
                    const me = decodeddata;

                    const Dbuser = users.find(({ email }) => email === decodeddata.email);

                    res.send({
                        sucess: true,
                        status: "ok",
                        message: "user data",
                        profile: me,
                        token: token,
                    });
                }
            }
        }
    );
});

app.get("/authenticate", auth, async(req, res) => {
    try {
        function extractToken(req) {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                return req.headers.authorization.split(" ")[1];
            } else if ((req.query && req.query.token) || req.headers.token) {
                return req.query.token || req.headers.token;
            }
            return null;
        }

        const token = extractToken(req);
        console.log(token);

        var decoded = jsonwebtoken.verify(token, config.secret);
        //  var decoded = jwt.verify(req.headers.token)

        if (decoded) {
            res.send(decoded);
        } else {
            res.send({
                sucess: false,
                message: "invalid token",
            });
        }
    } catch (err) {
        console.log(err.message);
        res.send({
            sucess: false,
            message: "invalid token",
        });
    }
});

function checkAvailability(arr, val) {
    return arr.some((arrVal) => arrVal.email === val);
}

function checkAvailabilityrefreshtoen(arr, val) {
    return arr.some((arrVal) => arrVal.refreshtoken === val);
}

function extractToken(req) {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    } else if ((req.query && req.query.token) || req.headers.token) {
        return req.query.token || req.headers.token;
    }
    return null;
}

function extractrefreshtoken(req) {
    if (req.headers.refreshtoken) {
        return req.headers.refreshtoken;
    } else {
        return null;
    }
}

app.listen(3002, () => console.log("Server running on PORT 3002"));