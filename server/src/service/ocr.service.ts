import Tesseract from 'tesseract.js';
import { IOcrService } from '../interfaces/aadhaar.interface.js';

export class TesseractOcrService implements IOcrService {
  public async recognize(buffer: Buffer): Promise<string> {
    const { data } = await Tesseract.recognize(buffer, 'eng');
    return data?.text ?? '';
  }
}

