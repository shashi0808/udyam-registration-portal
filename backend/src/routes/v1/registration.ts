import express from 'express';
import { 
  sendOTP,
  verifyOTP,
  validatePAN,
  submitRegistration,
  lookupPinCode
} from '../../controllers/registrationController';
import { validateRequest } from '../../middleware/validation';

const router = express.Router();

// Send OTP
router.post('/send-otp', validateRequest('sendOTP'), sendOTP);

// Verify OTP
router.post('/verify-otp', validateRequest('verifyOTP'), verifyOTP);

// Validate PAN
router.post('/validate-pan', validateRequest('validatePAN'), validatePAN);

// Submit registration
router.post('/submit-registration', validateRequest('submitRegistration'), submitRegistration);

// PIN code lookup
router.get('/pin-lookup/:pincode', lookupPinCode);

export default router;