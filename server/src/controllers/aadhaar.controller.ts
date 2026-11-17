import { NextFunction, Request, Response } from 'express';
import {
  IAadhaarController,
  IAadhaarService,
} from '../interfaces/aadhaar.interface.js';

export class AadhaarController implements IAadhaarController {
  constructor(private readonly aadhaarService: IAadhaarService) {}

  public upload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const result = await this.aadhaarService.processDocuments(files);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
