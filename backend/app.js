const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
const auth = require("./middleware/auth");

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
        hash: "WtXFaTcmkuHCIxMJ2Z/f0IEylWx9a2BSCwETzNs2aeAvz+WB7SaSCr/zlf8ssO2jKwh50XAS7AcBKs4SjosHQttytLw+ck6igbqbZsoQnpMSffhH4kkyMW/s8kLADupo8B7AjPv0iYXlInjBj5P53ytYMxeLOCMNCImmhf1Lk7qB8PeSgK3TthbOXbJZYi6VCwZKOiBXReHqaPq8m4Co+mxP4s5+mdlhc0SaMxUCEHVc1sPrK+h0y7mRGn4SgM5kovjP8qeRLu7T5lniwIIBBDeS74/ljd6pq7xC3kexDx5r5i3w4Rkqn3PfgtuFpmLYyic+UjlLvX0Q0Qs0S8g8LA==",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWQiOjMsImltYWdlIjoiaHR0cHM6Ly9uYW5vZ3VhcmQuaW4vd3AtY29udGVudC91cGxvYWRzLzIwMTkvMDkvcGljLmpwZyIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3QiLCJpYXQiOjE2MjA3NDU2MDgsImV4cCI6MTYyMDgzMjAwOH0.tnxgGEWpSCyeb8EIu_wFsJkPEsW5G4D6bhymhR8q3C8",
    },
];

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
    var _user = req.body;
    console.log(_user);

    id = users.length + 1;
    var tempUser = {
        ..._user,
        id: id,
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
                .pbkdf2Sync(req.body.password, tempUser.salt, 10000, 256, "sha512")
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
    const Dbuser = users.find(({ email }) => email === req.body.email);

    const hashedPassword = crypto
        .pbkdf2Sync(req.body.password, Dbuser.salt, 10000, 256, "sha512")
        .toString("base64");

    if (hashedPassword === Dbuser.hash) {
        const _payload = {
            email: Dbuser.email,
            id: Dbuser.id,
            image: Dbuser.image,

            firstName: Dbuser.firstName,
            lastName: user.lastName,
        };
        const token = jsonwebtoken.sign(
            _payload,
            "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING", { expiresIn: "1d" }
        );

        Dbuser.token = token;

        res.send({
            sucess: false,
            status: "failed",
            message: "sucess",
            token: token,
            user: _payload,
        });
    } else {
        res.send({
            sucess: false,
            status: "failed",
            message: "incorrect password",
        });
    }
});

app.get("/me", async(req, res) => {
    var token = extractToken(req);
    console.log(token);

    const decoded = jsonwebtoken.verify(
        token,
        "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
    );
    const me = decoded;

    const Dbuser = users.find(({ email }) => email === decoded.email);

    res.send({
        sucess: false,
        status: "failed",
        message: "incorrect password",
        profile: me,
        token: token,
    });
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

        var decoded = jsonwebtoken.verify(
            token,
            "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
        );
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

app.listen(3002, () => console.log("Server running on PORT 3002"));