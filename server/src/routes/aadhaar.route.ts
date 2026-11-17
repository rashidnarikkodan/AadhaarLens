import { Router } from 'express';
import { upload } from '../config/multer.config.js';
import { env } from '../config/env.config.js';
import { AadhaarController } from '../controllers/aadhaar.controller.js';
import { AadhaarService } from '../service/aadhaar.service.js';
import { AadhaarFileValidator } from '../service/aadhaar-validator.service.js';
import { AadhaarDocumentValidator } from '../service/aadhaar-document-validator.service.js';
import { AadhaarDetailsValidator } from '../service/aadhaar-details-validator.service.js';
import { TesseractOcrService } from '../service/ocr.service.js';
import { AadhaarParser } from '../service/aadhaar-parser.service.js';
import { GoogleAiProvider } from '../providers/google-ai.provider.js';

const router = Router();

const fileValidator = new AadhaarFileValidator();
const documentValidator = new AadhaarDocumentValidator();
const detailsValidator = new AadhaarDetailsValidator();
const ocrService = new TesseractOcrService();
const parser = new AadhaarParser();
const aiProvider = new GoogleAiProvider(env.GEMINI_API_KEY);

const aadhaarService = new AadhaarService(
  fileValidator,
  documentValidator,
  ocrService,
  parser,
  detailsValidator,
  aiProvider
);
const aadhaarController = new AadhaarController(aadhaarService);

router.post(
  '/',
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
  ]),
  aadhaarController.upload
);

export default router;
