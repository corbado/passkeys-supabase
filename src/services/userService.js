const db = require("../../models");
const User = db.user;
const bcrypt = require("bcryptjs");

exports.create = async (name, email, password = null) => {
    let hashedPassword = null;
    if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const user = {
        name: name,
        email: email,
        password: hashedPassword,
    }

    return User.create(user)
}

exports.findByEmail = (email) => {
    return User.findOne({where: {email: email}})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
        })
};

exports.findById = (id) => {
    return User.findOne({where: {id: id}})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
        });
}
