import { Request, Response, NextFunction } from 'express';
import { Details } from '../types/index.js';

export type AadhaarSide = 'FRONT' | 'BACK' | 'INVALID';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface IFileValidator {
  validate(files: { [fieldname: string]: Express.Multer.File[] } | undefined): ValidationResult;
}

export interface IAadhaarDocumentValidator {
  validate(frontText: string, backText: string): ValidationResult;
  classifySide(text: string): AadhaarSide;
}

export interface IDetailsValidator {
  validate(details: Details): string[];
}

export interface AadhaarProcessResult {
  success: boolean;
  message: string;
  data?: Details;
  errors?: string[];
}

export interface IOcrService {
  recognize(buffer: Buffer): Promise<string>;
}

export interface IAadhaarParser {
  parse(frontText: string, backText: string): Details;
}

export interface IAiProvider {
  isAvailable(): boolean;
  parseAadhaarText(frontText: string, backText: string): Promise<Details | null>;
}

export interface IAadhaarService {
  processDocuments(
    files: { [fieldname: string]: Express.Multer.File[] } | undefined
  ): Promise<AadhaarProcessResult>;
}

export interface IAadhaarController {
  upload(req: Request, res: Response, next: NextFunction): Promise<void>;
}
