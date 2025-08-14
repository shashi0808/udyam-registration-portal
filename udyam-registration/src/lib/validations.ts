import { z } from 'zod';

// Validation schemas using Zod
export const aadhaarSchema = z.string()
  .min(12, 'Aadhaar number must be 12 digits')
  .max(12, 'Aadhaar number must be 12 digits')
  .regex(/^[0-9]{12}$/, 'Aadhaar number must contain only digits');

export const otpSchema = z.string()
  .min(6, 'OTP must be 6 digits')
  .max(6, 'OTP must be 6 digits')
  .regex(/^[0-9]{6}$/, 'OTP must contain only digits');

export const panSchema = z.string()
  .min(10, 'PAN must be 10 characters')
  .max(10, 'PAN must be 10 characters')
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)');

export const mobileSchema = z.string()
  .min(10, 'Mobile number must be 10 digits')
  .max(10, 'Mobile number must be 10 digits')
  .regex(/^[6-9][0-9]{9}$/, 'Mobile number must start with 6, 7, 8, or 9');

export const emailSchema = z.string()
  .email('Please enter a valid email address');

export const pinCodeSchema = z.string()
  .min(6, 'PIN code must be 6 digits')
  .max(6, 'PIN code must be 6 digits')
  .regex(/^[0-9]{6}$/, 'PIN code must contain only digits');

// Step 1 validation schema
export const step1Schema = z.object({
  aadhaarNumber: aadhaarSchema,
  otpNumber: otpSchema.optional(),
});

// Step 2 validation schema
export const step2Schema = z.object({
  panNumber: panSchema,
  applicantName: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select your gender',
  }),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 18 && age <= 100;
    }, 'You must be between 18 and 100 years old'),
  mobileNumber: mobileSchema,
  emailAddress: emailSchema,
  address: z.string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  pinCode: pinCodeSchema,
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
});

// Combined validation schema
export const fullFormSchema = step1Schema.merge(step2Schema);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type FullFormData = z.infer<typeof fullFormSchema>;

// Validation helper functions
export const validateField = (fieldName: string, value: string): string | null => {
  try {
    switch (fieldName) {
      case 'aadhaarNumber':
        aadhaarSchema.parse(value);
        break;
      case 'otpNumber':
        otpSchema.parse(value);
        break;
      case 'panNumber':
        panSchema.parse(value);
        break;
      case 'mobileNumber':
        mobileSchema.parse(value);
        break;
      case 'emailAddress':
        emailSchema.parse(value);
        break;
      case 'pinCode':
        pinCodeSchema.parse(value);
        break;
      default:
        return null;
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Invalid value';
    }
    return 'Validation error';
  }
};

// Format helpers
export const formatAadhaar = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 12);
};

export const formatPAN = (value: string): string => {
  return value.toUpperCase().slice(0, 10);
};

export const formatMobile = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 10);
};

export const formatPinCode = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 6);
};

export const formatOTP = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 6);
};