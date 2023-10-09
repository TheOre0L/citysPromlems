const Joi = require('joi')
exports.userValidation = (data) => {

    const schemaReg = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        surname: Joi.string().min(2).max(255).required(),
        city: Joi.string().min(2).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
        login: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(2).max(255).required().email(),
    })

return schemaReg.validate(data)
}