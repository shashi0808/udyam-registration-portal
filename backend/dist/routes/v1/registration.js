"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrationController_1 = require("../../controllers/registrationController");
const validation_1 = require("../../middleware/validation");
const router = express_1.default.Router();
// Send OTP
router.post('/send-otp', (0, validation_1.validateRequest)('sendOTP'), registrationController_1.sendOTP);
// Verify OTP
router.post('/verify-otp', (0, validation_1.validateRequest)('verifyOTP'), registrationController_1.verifyOTP);
// Validate PAN
router.post('/validate-pan', (0, validation_1.validateRequest)('validatePAN'), registrationController_1.validatePAN);
// Submit registration
router.post('/submit-registration', (0, validation_1.validateRequest)('submitRegistration'), registrationController_1.submitRegistration);
// PIN code lookup
router.get('/pin-lookup/:pincode', registrationController_1.lookupPinCode);
exports.default = router;
//# sourceMappingURL=registration.js.map