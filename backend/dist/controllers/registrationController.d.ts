import { Request, Response, NextFunction } from 'express';
export declare const sendOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validatePAN: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const submitRegistration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const lookupPinCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllRegistrations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=registrationController.d.ts.map