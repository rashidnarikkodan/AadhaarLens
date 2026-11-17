import { IDetailsValidator } from '../interfaces/aadhaar.interface.js';
import { Details } from '../types/index.js';

export class AadhaarDetailsValidator implements IDetailsValidator {
  private readonly requiredFields: (keyof Details)[] = [
    'name',
    'dob',
    'gender',
    'aadhaar_number',
    'address',
  ];

  public validate(details: Details): string[] {
    const errors: string[] = [];
    for (const field of this.requiredFields) {
      if (!details[field]) {
        errors.push(`${field} is not available`);
      }
    }
    return errors;
  }
}

