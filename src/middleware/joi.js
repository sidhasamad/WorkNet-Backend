import Joi from "joi";
export const registerValidation =Joi.object({
  name:Joi.string().required().min(3).max(15),
  email:Joi.string().email().required(),
  password:Joi.string().required().min(6)
})