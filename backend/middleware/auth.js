const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {

    /*token extractraction from headers bearer or token in headers */
    function extractToken(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token || req.headers.token) {
            return req.query.token || req.headers.token
        }
        return null;
    }


    const token = extractToken(req)
    console.log(token)

    //   const token = req.header("token");

    /*if token doesnt available in req headers */

    if (!token) return res.status(401).json({ sucess: false, message: "Auth Error" });
    /* check token validity */

    try {
        const decoded = jwt.verify(token, "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING");
        req.user = decoded.user;

        //  console.log(decoded)
        next();
    } catch (e) {
        /*if invalid token */
        console.error(e);
        res.status(500).send({ sucess: false, message: "Invalid Token" });
    }
};