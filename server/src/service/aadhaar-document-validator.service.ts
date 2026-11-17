import {
  AadhaarSide,
  IAadhaarDocumentValidator,
  ValidationResult,
} from '../interfaces/aadhaar.interface.js';

export class AadhaarDocumentValidator implements IAadhaarDocumentValidator {
  private readonly frontMarkers: RegExp[] = [
    /(?:DOB|Date of Birth|Year of Birth|जन्म तारीख|जन्म वर्ष)/i,
    /\b(?:Male|Female|Transgender|पुरुष|महिला)\b/i,
    /(?:Mera Aadhaar|Meri Pehchan|मेरा आधार|मेरी पहचान)/i,
  ];

  private readonly backMarkers: RegExp[] = [
    /(?:Address|पता|To:)/i,
    /\b[1-9][0-9]{5}\b/,
    /(?:C\/O|S\/O|D\/O|W\/O|Care of|आत्मज|पत्नी)/i,
    /(?:1947|help@uidai\.gov\.in|www\.uidai\.gov\.in|uidai\.gov\.in)/i,
  ];

  private readonly commonMarkers: RegExp[] = [
    /\b(?:\d{4}\s\d{4}\s\d{4}|\d{12}|[X\d]{4}\s[X\d]{4}\s\d{4})\b/i,
    /(?:Government of India|Govt\. of India|भारत सरकार)/i,
    /(?:Unique Identification|UIDAI|भारतीय विशिष्ट पहचान)/i,
    /(?:Aadhaar|Aadhar|आधार)/i,
  ];

  public validate(frontText: string, backText: string): ValidationResult {
    const errors: string[] = [];

    const frontSide = this.classifySide(frontText);
    const backSide = this.classifySide(backText);

    if (frontSide === 'BACK') {
      errors.push('Front upload appears to be the back side of an Aadhaar card. Please upload the front side.');
    } else if (frontSide === 'INVALID') {
      errors.push('Front image does not appear to be a valid Aadhaar card.');
    }

    if (backSide === 'FRONT') {
      errors.push('Back upload appears to be the front side of an Aadhaar card. Please upload the back side.');
    } else if (backSide === 'INVALID') {
      errors.push('Back image does not appear to be a valid Aadhaar card.');
    }

    if (frontText.trim().length > 20 && frontText.trim() === backText.trim()) {
      errors.push('Front and back images cannot be identical.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public classifySide(text: string): AadhaarSide {
    if (!text || text.trim().length === 0) {
      return 'INVALID';
    }

    const frontScore = this.countMatches(text, this.frontMarkers);
    const backScore = this.countMatches(text, this.backMarkers);
    const commonScore = this.countMatches(text, this.commonMarkers);

    const totalScore = frontScore + backScore + commonScore;
    if (totalScore < 2) {
      return 'INVALID';
    }

    if (backScore > 0 && backScore >= frontScore) {
      return 'BACK';
    }

    if (frontScore > 0 && frontScore >= backScore) {
      return 'FRONT';
    }

    if (commonScore >= 2) {
      return frontScore >= backScore ? 'FRONT' : 'BACK';
    }

    return 'INVALID';
  }

  private countMatches(text: string, patterns: RegExp[]): number {
    return patterns.reduce((count, pattern) => (pattern.test(text) ? count + 1 : count), 0);
  }
}
