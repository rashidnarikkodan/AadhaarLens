import { IFileValidator, ValidationResult } from '../interfaces/aadhaar.interface.js';

export class AadhaarFileValidator implements IFileValidator {
  private readonly maxFileSizeBytes: number = 5 * 1024 * 1024;

  public validate(files: { [fieldname: string]: Express.Multer.File[] } | undefined): ValidationResult {
    const errors: string[] = [];
    const front = files?.front?.[0];
    const back = files?.back?.[0];

    errors.push(...this.validateFile(front, 'Front'));
    errors.push(...this.validateFile(back, 'Back'));

    if (front && back && front.buffer && back.buffer && front.buffer.equals(back.buffer)) {
      errors.push('Front and back uploads cannot be the same file.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateFile(file: Express.Multer.File | undefined, fieldName: string): string[] {
    if (!file || !file.buffer) {
      return [`${fieldName} image is required.`];
    }

    const errs: string[] = [];

    if (file.buffer.length === 0 || file.size === 0) {
      errs.push(`${fieldName} image file cannot be empty.`);
    }

    if (file.size > this.maxFileSizeBytes) {
      errs.push(`${fieldName} image exceeds maximum allowed size of 5MB.`);
    }

    if (!file.mimetype.startsWith('image/')) {
      errs.push(`${fieldName} file must be a valid image.`);
    }

    return errs;
  }
}
