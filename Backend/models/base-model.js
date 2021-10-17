class BaseModel {

    constructor(vacationId) {
        this.vacationId = vacationId;//in the user model and credentials model I deleted this field, when user registers I used the User model and id will be created for him, and when login I used Credentials model and just compared the credentials he sent with userName and password of existing users, still no need for id
    }

    static customErrors(errors) {//error message by error types
        for (const err of errors) {
            switch (err.code) {
                case "any.required":
                case "string.empty": err.message = `Missing "${err.local.label}".`;
                    break;
                case "string.base": err.message = `"${err.local.label}" must be a string.`;
                    break;
                case "string.min": err.message = `"${err.local.label}" must be minimum ${err.local.limit} char${err.local.limit > 1 ? "s" : ""}.`;
                    break;
                case "string.max": err.message = `"${err.local.label}" can't exceed ${err.local.limit} chars.`;
                    break;
                case "string.pattern.base": err.message = `"${err.local.label}" don't match the pattern ${err.local.regex}.`;
                    break;
                case "number.base": err.message = `"${err.local.label}" must be a number.`;
                    break;
                case "number.integer": err.message = `"${err.local.label}" must be an integer.`;
                    break;
                case "number.positive": err.message = `"${err.local.label}" must be positive.`;
                    break;
                case "number.min": err.message = `"${err.local.label}" must be minimum ${err.local.limit}.`;
                    break;
                case "number.max": err.message = `"${err.local.label}" can't exceed ${err.local.limit}.`;
                    break;
                case "date.base": err.message = `"${err.local.label}" must be a valid date.`;
                    break;
            }
        }
        return errors;
    }
}

module.exports = BaseModel;