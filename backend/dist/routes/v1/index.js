"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registration_1 = __importDefault(require("./registration"));
const router = express_1.default.Router();
// Registration routes
router.use('/', registration_1.default);
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
exports.default = router;
//# sourceMappingURL=index.js.map