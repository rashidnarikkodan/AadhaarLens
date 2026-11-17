import { IAadhaarParser } from '../interfaces/aadhaar.interface.js';
import { AddressDetails, Details } from '../types/index.js';

export class AadhaarParser implements IAadhaarParser {
  private readonly indianStates: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Puducherry',
    'Chandigarh',
  ];

  public parse(frontText: string, backText: string): Details {
    const combinedText = `${frontText}\n${backText}`;
    const details: Details = {};

    const name = this.extractName(frontText);
    if (name) {
      details.name = name;
    }

    const dob = this.extractDob(frontText) || this.extractDob(combinedText);
    if (dob) {
      details.dob = dob;
    }

    const gender = this.extractGender(frontText) || this.extractGender(combinedText);
    if (gender) {
      details.gender = gender;
    }

    const aadhaarNumber = this.extractAadhaarNumber(combinedText);
    if (aadhaarNumber) {
      details.aadhaar_number = aadhaarNumber;
    }

    const address = this.extractAddress(backText, combinedText);
    if (address && Object.keys(address).length > 0) {
      details.address = address;
    }

    return details;
  }

  private extractAadhaarNumber(text: string): string | null {
    const pattern = /\b(?:\d{4}\s\d{4}\s\d{4}|\d{12}|[X\d]{4}\s[X\d]{4}\s\d{4})\b/i;
    const match = text.match(pattern);
    if (!match) return null;

    const raw = match[0].trim();
    if (raw.length === 12 && !raw.includes(' ')) {
      return `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8, 12)}`;
    }
    return raw;
  }

  private extractDob(text: string): string | null {
    const dobPattern = /(?:DOB|Date of Birth|Birth|YOB)[:\s]*([0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4})/i;
    const dobMatch = text.match(dobPattern);
    if (dobMatch?.[1]) {
      return dobMatch[1].replace(/-/g, '/');
    }

    const genericDate = /\b([0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4})\b/;
    const dateMatch = text.match(genericDate);
    if (dateMatch?.[1]) {
      return dateMatch[1].replace(/-/g, '/');
    }

    const yobPattern = /(?:Year of Birth|YOB)[:\s]*([0-9]{4})/i;
    const yobMatch = text.match(yobPattern);
    if (yobMatch?.[1]) {
      return yobMatch[1];
    }

    return null;
  }

  private extractGender(text: string): string | null {
    const match = text.match(/\b(Female|Male|Transgender)\b/i);
    if (!match?.[1]) return null;

    const lower = match[1].toLowerCase();
    if (lower === 'female') return 'Female';
    if (lower === 'male') return 'Male';
    return 'Transgender';
  }

  private extractName(text: string): string | null {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const ignoredKeywords = [
      'government',
      'india',
      'unique',
      'identification',
      'authority',
      'enrollment',
      'help',
      'aadhaar',
      'dob',
      'birth',
      'male',
      'female',
      'father',
      'year',
      'mera',
      'meri',
      'pehchan',
      'card',
      'address',
    ];

    for (const line of lines) {
      const lower = line.toLowerCase();
      const hasIgnored = ignoredKeywords.some((keyword) => lower.includes(keyword));
      const hasDigits = /\d/.test(line);

      if (!hasIgnored && !hasDigits && line.length >= 3 && line.length <= 40) {
        if (/^[a-zA-Z\s\.]+$/.test(line)) {
          const words = line.split(/\s+/).filter(Boolean);
          if (words.length >= 1 && words.length <= 4) {
            return line;
          }
        }
      }
    }

    return null;
  }

  private extractAddress(backText: string, combinedText: string): AddressDetails | undefined {
    const text = backText.trim().length > 20 ? backText : combinedText;
    const address: AddressDetails = {};

    const pincodeMatch = text.match(/\b([1-9][0-9]{5})\b/);
    if (pincodeMatch?.[1]) {
      address.pincode = pincodeMatch[1];
    }

    const careOfMatch = text.match(/(?:C\/O|S\/O|D\/O|W\/O|Care of|Son of|Daughter of|Wife of)[:\s]*([^\n,]+)/i);
    if (careOfMatch?.[1]) {
      const careOf = careOfMatch[1].trim();
      if (careOf.length > 0) {
        address.care_of = careOf;
      }
    }

    for (const state of this.indianStates) {
      if (new RegExp(`\\b${state}\\b`, 'i').test(text)) {
        address.state = state;
        break;
      }
    }

    const addressAnchor = text.match(/(?:Address|Addr|To|पता)[:\s]*([\s\S]*?)(?=\b\d{6}\b|$)/i);
    if (addressAnchor?.[1]) {
      const cleaned = addressAnchor[1]
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned.length > 5) {
        const withoutTrailing = cleaned.replace(/[-,\s]+$/, '');
        address.full_address = address.pincode ? `${withoutTrailing} - ${address.pincode}` : withoutTrailing;

        const segments = withoutTrailing.split(',').map((s) => s.trim()).filter(Boolean);
        if (segments[0]) address.house = segments[0];
        if (segments[1]) address.street = segments[1];
        if (segments[2]) address.locality = segments[2];
        if (segments[3]) address.district = segments[3];
      }
    }

    return Object.keys(address).length > 0 ? address : undefined;
  }
}
