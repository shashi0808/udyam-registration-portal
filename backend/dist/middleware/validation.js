"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const errorHandler_1 = require("./errorHandler");
const schemas = {
    sendOTP: {
        aadhaarNumber: {
            required: true,
            type: 'string',
            pattern: /^[0-9]{12}$/,
            message: 'Aadhaar number must be 12 digits'
        }
    },
    verifyOTP: {
        aadhaarNumber: {
            required: true,
            type: 'string',
            pattern: /^[0-9]{12}$/,
            message: 'Aadhaar number must be 12 digits'
        },
        otp: {
            required: true,
            type: 'string',
            pattern: /^[0-9]{6}$/,
            message: 'OTP must be 6 digits'
        }
    },
    validatePAN: {
        panNumber: {
            required: true,
            type: 'string',
            pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            message: 'PAN must be in format: 5 letters, 4 digits, 1 letter'
        }
    },
    submitRegistration: {
        aadhaarNumber: {
            required: true,
            type: 'string',
            pattern: /^[0-9]{12}$/,
            message: 'Aadhaar number must be 12 digits'
        },
        otpNumber: {
            required: true,
            type: 'string',
            pattern: /^[0-9]{6}$/,
            message: 'OTP must be 6 digits'
        },
        panNumber: {
            required: true,
            type: 'string',
            pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            message: 'PAN must be in correct format'
        },
        applicantName: {
            required: true,
            type: 'string',
            minLength: 2,
            maxLength: 100,
            message: 'Name must be between 2 and 100 characters'
        },
        gender: {
            required: true,
            type: 'string',
            message: 'Gender is required'
        },
        dateOfBirth: {
            required: true,
            type: 'string',
            message: 'Date of birth is required'
        },
        mobileNumber: {
            required: true,
            type: 'string',
            pattern: /^[6-9][0-9]{9}$/,
            message: 'Mobile number must be 10 digits starting with 6-9'
        },
        emailAddress: {
            required: true,
            type: 'email',
            message: 'Valid email address is required'
        },
        address: {
            required: true,
            type: 'string',
            minLength: 10,
            maxLength: 500,
            message: 'Address must be between 10 and 500 characters'
        },
        pinCode: {
            required: true,
            type: 'string',
            pattern: /^[0-9]{6}$/,
            message: 'PIN code must be 6 digits'
        },
        city: {
            required: true,
            type: 'string',
            message: 'City is required'
        },
        state: {
            required: true,
            type: 'string',
            message: 'State is required'
        }
    }
};
const validateField = (value, rules) => {
    if (rules.required && (!value || value.toString().trim() === '')) {
        return rules.message || 'This field is required';
    }
    if (!value)
        return null; // Skip validation if not required and empty
    const stringValue = value.toString().trim();
    if (rules.type === 'email') {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(stringValue)) {
            return rules.message || 'Invalid email format';
        }
    }
    if (rules.pattern && !rules.pattern.test(stringValue)) {
        return rules.message || 'Invalid format';
    }
    if (rules.minLength && stringValue.length < rules.minLength) {
        return rules.message || `Minimum length is ${rules.minLength}`;
    }
    if (rules.maxLength && stringValue.length > rules.maxLength) {
        return rules.message || `Maximum length is ${rules.maxLength}`;
    }
    return null;
};
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return next();
        }
        const errors = {};
        for (const [field, rules] of Object.entries(schema)) {
            const error = validateField(req.body[field], rules);
            if (error) {
                errors[field] = error;
            }
        }
        if (Object.keys(errors).length > 0) {
            return next((0, errorHandler_1.createError)(`Validation failed: ${Object.values(errors).join(', ')}`, 400));
        }
        next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.js.map