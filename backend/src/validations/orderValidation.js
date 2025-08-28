const Joi = require('joi');

const createOrderSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Order title is required',
      'string.min': 'Order title must be at least 3 characters long',
      'string.max': 'Order title must not exceed 255 characters',
      'any.required': 'Order title is required'
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),

  priority: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'URGENT')
    .default('MEDIUM')
    .messages({
      'any.only': 'Priority must be one of LOW, MEDIUM, HIGH, URGENT'
    }),

  estimatedCompletion: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.base': 'Estimated completion date must be valid',
      'date.min': 'Estimated completion date cannot be in the past'
    })
});

module.exports = {
  createOrderSchema
};
