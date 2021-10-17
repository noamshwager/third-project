const Joi = require("joi");
const BaseModel = require("./base-model");

class Credentials {

    constructor(credentials) {
        this.userName = credentials.userName;
        this.password = credentials.password;
    }

    static #validationSchema = Joi.object({
        userName: Joi.string().required().min(4).max(25),
        password: Joi.string().required().min(4).max(25)
    }).error(BaseModel.customErrors);

    validate() {
        const result = Credentials.#validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = Credentials;