const db = require("../models");
const Properties = db.properties;
const crypto = require("crypto");

exports.AddProperties = async(req, res) => {

    const _properties = req.body.property

    console.log(_properties)
    const properties = new Properties({

        name: _properties.name,
        image: _properties.image,
        descrioption: _properties.descrioption,
        location: _properties.location,
        price: _properties.price,
        phone: _properties.phone,
        postedBy: _properties.postedBy,
        userId: _properties.userId

    })

    properties
        .save(properties)
        .then((data) => {
            res.send({
                sucess: true,
                Properties: data,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Properties.",
            });
        });
};

exports.getProperties = async(req, res) => {


    Properties.find()
        .then(data => {
            res.send({

                sucess: true,
                properties: data

            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving properties."
            });
        });
};
