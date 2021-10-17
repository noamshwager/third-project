const Joi = require("joi");
const BaseModel = require("./base-model");

class User extends BaseModel {

    constructor(user) {
        super(user.vacationId);
        delete this.vacationId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.userName = user.userName;
        this.password = user.password;
    }

    static #validationSchema = Joi.object({
        firstName: Joi.string().required().min(2).max(30),
        lastName: Joi.string().required().min(2).max(30),
        userName: Joi.string().required().min(4).max(25),
        password: Joi.string().required().min(4).max(25),
    }).error(BaseModel.customErrors);

    validate() {
        const result = User.#validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = User;