import { AadhaarDetailsValidator } from './aadhaar-details-validator.service.js';
import { Details } from '../types/index.js';

export { AadhaarDetailsValidator } from './aadhaar-details-validator.service.js';

export const detailsValidator = new AadhaarDetailsValidator();
export const validateDetails = (details: Details): string[] => detailsValidator.validate(details);
