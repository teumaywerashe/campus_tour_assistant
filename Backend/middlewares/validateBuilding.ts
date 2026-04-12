import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const buildingSchema = Joi.object({
  name: Joi.string().max(100).required(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  category: Joi.string().max(50).optional(),
  images: Joi.string().required(),
});

const validateBuilding = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = buildingSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }
  next();
};

export default validateBuilding;
