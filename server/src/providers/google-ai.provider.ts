import { GoogleGenAI } from '@google/genai';
import { IAiProvider } from '../interfaces/aadhaar.interface.js';
import { Details } from '../types/index.js';

export class GoogleAiProvider implements IAiProvider {
  private readonly client: GoogleGenAI | null = null;
  private readonly modelName: string;

  constructor(apiKey?: string, modelName: string = 'gemini-2.5-flash') {
    this.modelName = modelName;
    if (apiKey && apiKey.trim().length > 0) {
      this.client = new GoogleGenAI({
        apiKey: apiKey.trim(),
        apiVersion: 'v1beta',
      });
    }
  }

  public isAvailable(): boolean {
    return this.client !== null;
  }

  public async parseAadhaarText(frontText: string, backText: string): Promise<Details | null> {
    if (!this.client) {
      return null;
    }

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: this.buildPrompt(frontText, backText),
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        return null;
      }

      return this.sanitizeAndParseJson(responseText);
    } catch (error) {
      console.error('Google AI parsing error:', error);
      return null;
    }
  }

  private buildPrompt(frontText: string, backText: string): string {
    return `You are an expert parser for Indian Aadhaar cards.
You are provided with raw OCR text transcribed from an Aadhaar card (front and back).
Analyze the OCR text, fix optical scan corruptions or noise, and map it into the following predefined JSON structure:

{
  "name": "Full Name in English",
  "dob": "DD/MM/YYYY",
  "gender": "Male | Female | Transgender",
  "aadhaar_number": "XXXX XXXX XXXX",
  "address": {
    "full_address": "Clean formatted address without OCR artifacts or helpdesk phone/URL text",
    "care_of": "C/O, S/O, D/O, or W/O name if present",
    "house": "House name or number if present",
    "street": "Street name if present",
    "locality": "Locality or area if present",
    "district": "District name if present",
    "state": "State name if present",
    "pincode": "6-digit postal PIN code"
  }
}

Rules:
1. Remove all OCR junk, symbols, helpline details (such as 1947, help@uidai.gov.in, www.uidai.gov.in), and broken punctuation from the address.
2. If the name text was mangled by regional script OCR, attempt to extract or reconstruct the true English name.
3. If a field cannot be determined from the text, omit that key entirely from the JSON object.
4. Return ONLY valid JSON.

Front OCR Text:
${frontText}

Back OCR Text:
${backText}`;
  }

  private sanitizeAndParseJson(raw: string): Details | null {
    try {
      const cleanJson = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/```\s*$/, '')
        .trim();
      return JSON.parse(cleanJson) as Details;
    } catch {
      return null;
    }
  }
}
