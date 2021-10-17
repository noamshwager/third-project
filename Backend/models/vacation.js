const Joi = require("joi");
const BaseModel = require("./base-model");

class Vacation extends BaseModel {

    constructor(vacation) {
        super(vacation.vacationId);
        this.location = vacation.location;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.description = vacation.description;
    }

    static #validationSchema = Joi.object({
        vacationId: Joi.number().optional().integer().positive(),
        location: Joi.string().required().min(3).max(100),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        price: Joi.number().required().min(0).max(10000),
        description: Joi.string().required().min(65).max(140),
    }).error(BaseModel.customErrors);

    validate() {
        const result = Vacation.#validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = Vacation;