const { stringify } = require("querystring");

module.exports = mongoose => {
    var schema = mongoose.Schema({
        id: String,
        name: String,
        image: String,
        descrioption: String,
        location: String,
        price: String,
        phone: Number,
        postedBy: String,
        userId: String





    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Properties = mongoose.model("properties", schema);
    return Properties;
};
