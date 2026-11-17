import {
  AadhaarProcessResult,
  IAadhaarDocumentValidator,
  IAadhaarParser,
  IAadhaarService,
  IAiProvider,
  IDetailsValidator,
  IFileValidator,
  IOcrService,
} from '../interfaces/aadhaar.interface.js';
import { Details } from '../types/index.js';

export class AadhaarService implements IAadhaarService {
  constructor(
    private readonly validator: IFileValidator,
    private readonly documentValidator: IAadhaarDocumentValidator,
    private readonly ocrService: IOcrService,
    private readonly parser: IAadhaarParser,
    private readonly detailsValidator: IDetailsValidator,
    private readonly aiProvider?: IAiProvider
  ) {}

  public async processDocuments(
    files: { [fieldname: string]: Express.Multer.File[] } | undefined
  ): Promise<AadhaarProcessResult> {
    const fileValidation = this.validator.validate(files);
    if (!fileValidation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: fileValidation.errors,
      };
    }

    const frontFile = files?.front?.[0];
    const backFile = files?.back?.[0];

    if (!frontFile || !backFile) {
      return {
        success: false,
        message: 'Both front and back images are required',
      };
    }

    const [frontText, backText] = await Promise.all([
      this.ocrService.recognize(frontFile.buffer),
      this.ocrService.recognize(backFile.buffer),
    ]);

    const documentValidation = this.documentValidator.validate(frontText, backText);
    if (!documentValidation.isValid) {
      return {
        success: false,
        message: 'Aadhaar document verification failed',
        errors: documentValidation.errors,
      };
    }

    const data = await this.extractDetails(frontText, backText);
    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        message: 'Could not extract readable Aadhaar details from the images',
        errors: ['The images appear to be Aadhaar cards, but the text is unreadable or too blurry.'],
      };
    }

    const missingErrors = this.detailsValidator.validate(data);

    return {
      success: true,
      message: 'Aadhaar documents processed successfully',
      data,
      errors: missingErrors.length > 0 ? missingErrors : undefined,
    };
  }

  private async extractDetails(frontText: string, backText: string): Promise<Details | null> {
    if (this.aiProvider && this.aiProvider.isAvailable()) {
      const aiData = await this.aiProvider.parseAadhaarText(frontText, backText);
      if (aiData && Object.keys(aiData).length > 0) {
        return aiData;
      }
    }
    return this.parser.parse(frontText, backText);
  }
}
