import express from 'express';
import registrationRoutes from './registration';

const router = express.Router();

// Registration routes
router.use('/', registrationRoutes);

// V1 API info
router.get('/', (req, res) => {
  res.json({
    message: 'Udyam Registration API v1',
    endpoints: {
      sendOTP: 'POST /send-otp',
      verifyOTP: 'POST /verify-otp',
      validatePAN: 'POST /validate-pan',
      submitRegistration: 'POST /submit-registration',
      pinLookup: 'GET /pin-lookup/:pincode'
    }
  });
});

export default router;