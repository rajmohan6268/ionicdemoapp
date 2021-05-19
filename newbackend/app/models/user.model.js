const { stringify } = require("querystring");

module.exports = mongoose => {
    var schema = mongoose.Schema({
        id: String,
        email: String,
        role: String,
        password: String,
        image: String,
        username: String,
        token: String,
        refreshtoken: String,
        salt: String,
        hash: String,
        resetPasswordExpires: Number,
        passwordResetToken: String




    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Users = mongoose.model("users", schema);
    return Users;
};